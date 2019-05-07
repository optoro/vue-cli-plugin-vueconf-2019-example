const { EOL } = require('os')
const { readFileSync, writeFileSync } = require('fs')

function injectFileContents (path, re, string, position = 'after') {
  const { lines, renderIndex } = getMatchingLines(path, re)

  if (position === 'after') {
    lines.splice(renderIndex+1, 0, string)
  } else if (position === 'before') {
    const minIndex = Math.max(renderIndex, 0)
    lines.splice(minIndex, 0, string)
  }

  writeFileSync(path, lines.join(EOL), { encoding: 'utf-8' })
}

function getMatchingLines (path, re) {
  const contentMain = readFileSync(path, { encoding: 'utf-8' })
  const lines = contentMain.split(/\r?\n/g)
  const renderIndex = lines.findIndex(line => line.search(re) !== -1)

  return {
    lines,
    renderIndex
  }
}

module.exports = (api, options, rootOptions) => {
  const projectName = rootOptions.projectName

  api.extendPackage({
    dependencies: {
      'bootstrap-vue': '2.0.0-rc.19',
      'superagent': '^5.0.0'
    },
    devDependencies: {
      'postcss-flexbugs-fixes': '4.1.0'
    },
    scripts: {
      build: `vue-cli-service build --mode development`,
      'build:prod': `vue-cli-service build`,
      test: 'npm run test:unit',
      unit: `npm run test:unit`,
      watch: `vue-cli-service build --watch --mode development`
    },
    vue: {
      publicPath: `/assets/${projectName}/`,
    }
  })

  api.render('./template')

  api.onCreateComplete(() => {
    // add bootstrap-vue
    const bootstrapVueImportsString = `
    import BootstrapVue from 'bootstrap-vue'
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    `

    injectFileContents(api.entryFile, /import Vue/, bootstrapVueImportsString)

    const bootstrapVueConfigString = `
    Vue.use(BootstrapVue)
    `

    injectFileContents(api.entryFile, /import App/, bootstrapVueConfigString)

    // use global Honeybadger from OT
    const honeybadgerConfigString = `
    // configure global Honeybadger
    Honeybadger.configure({
      revision: COMMITHASH
    })
    `
    injectFileContents(api.entryFile, /new Vue\(\{/, honeybadgerConfigString, 'before')

    if (rootOptions.eslint) {
      // configure eslint for Honeybadger globals
      const eslintConfigString = `globals: {
        Honeybadger: "readonly",
        COMMITHASH: "readonly"
      },`

      injectFileContents('.eslintrc.js', /extends/, eslintConfigString, 'before')
    }
  })

  if (rootOptions.router) {
    // configure router to use Bootstrap classes
    api.onCreateComplete(() => {
      injectFileContents('src/router.js', /new Router\(\{/, `linkExactActiveClass: 'active',`)
    })
  }
}
