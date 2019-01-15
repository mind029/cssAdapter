const postcss = require('postcss');
const scss = require('postcss-scss');
const less = require('postcss-less');
const changePlugin = require('./postcss-change-vars')

/**
 * @param {string} language scss/less/sass
 */
const cssAdapter = function (language) {
  const syntax = {
    scss: scss,
    less: less
  }
  return syntax[language]
}

module.exports = function changeVars(style, opts) {
  // 获取当前 language 适配器。
  const adapter = cssAdapter(opts.language)

  // 调用 postcss 插件，进行变量值替换。
  return postcss([changePlugin(opts)]).process(style, { syntax: adapter })
}