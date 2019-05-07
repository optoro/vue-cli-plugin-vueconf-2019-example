const ManifestPlugin = require('webpack-manifest-plugin')
const HoneybadgerSourceMapPlugin = require('@honeybadger-io/webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin()
const COMMITHASH = gitRevisionPlugin.commithash()

module.exports = (api, options) => {
  // render asset manifest with version info
  api.chainWebpack(webpackConfig => {
    webpackConfig
      .plugin('manifest')
      .use(ManifestPlugin, [{
        fileName: 'output.json',
        filter: ({ isInitial }) => isInitial,
        generate: (seed, files) => {
          const manifest = files.reduce((manifest, { name, path }) => {
            // `isInitial == true` means we need it to boot the app, order doesnt matter,
            // see https://medium.com/webpack/webpack-4-changes-part-1-week-24-25-fd4d77674e55#dbe8
            return { ...manifest, [name]: path }
          }, seed)

          manifest.__commithash__ = COMMITHASH

          return manifest
        }
      }])
  })

  // setup development git-revision
  api.chainWebpack(webpackConfig => {
    webpackConfig
      .plugin('define')
      .tap(args => {
        args[0].COMMITHASH = '""'
        return args
      })
  })

  if (process.env.NODE_ENV === 'production') {
    // setup production git-revision
    api.chainWebpack(webpackConfig => {
      webpackConfig
        .plugin('define')
        .tap(args => {
          args[0].COMMITHASH = JSON.stringify(COMMITHASH)
          return args
        })
    })

    // setup Honeybadger with source maps and version tracking
    api.chainWebpack(webpackConfig => {
      webpackConfig
        .plugin('honeybadger')
        .use(HoneybadgerSourceMapPlugin, [{
          apiKey: process.env.VUE_APP_HONEYBADGER_API_KEY,
          assetsUrl: process.env.VUE_APP_HONEYBADGER_SOURCE_MAP_URL,
          revision: COMMITHASH,
          silent: false
        }])
    })
  }
}
