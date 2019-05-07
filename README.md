# `vue-cli-plugin-vueconf-2019-example`

`@vue/cli` 3.x plugin example by Optoro for VueConf US 2019, [watch the talk](https://www.vuemastery.com/conferences/vueconf-us-2019/vuejs-in-practice-at-optoro).

## Usage

```shell
vue add vueconf-2019-example
```

## Details

### Webpack

Plugins:

* [`ManifestPlugin`](https://github.com/danethurber/webpack-manifest-plugin): for generating a JSON output of the build assets
* [`HoneybadgerSourceMapPlugin`](https://github.com/honeybadger-io/honeybadger-webpack): for tracking deploys of staging/production builds to provide source maps for better stack traces
* `DefinePlugin`: `COMMITHASH` provides the git commit hash from [git-revision-webpack-plugin](https://github.com/pirelenito/git-revision-webpack-plugin)

### Generator

* `src/App.vue`: imports [`bootstrap-vue`](https://bootstrap-vue.js.org/) by default, uses Bootstrap template
* `.browserslistrc`: sets supported browsers
* `.env.*`: default configuration for different environments

## Bugs

### Nice to have

* Set `lintOnSave` to an expression like `process.env.NODE_ENV !== 'production !default'`

* Set `browserslist` with `api.extendpackage`, but cannot delete the entries that exist already, so we use a template instead
