const postcss = require('postcss');
const scss = require('postcss-scss');
const less = require('postcss-less');
const changePlugin = require('./postcss-change-vars')
const easyImport = require('postcss-easy-import')
const url = require('postcss-url')


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

  // postcss-url 处理样式文件中 url() 资源配置
  const urlOption = [
    { filter: '**/fonts/*.ttf', url: 'copy', assetsPath: 'fonts', useHash: true },
    { filter: '**/fonts/*.woff', url: 'copy', assetsPath: 'fonts', useHash: true }
  ]

  // 增加 easyImport 合并 import，easyImport 的 参数需要包含有  extensions: ['.scss','.css', '.less']
  // 否则无法找到相应 样式文件导入合并
  // 需要设置 主题的入口 from 字段。否则 easyImport 无法合并 @import 导入相关文件
  // 调用 postcss 插件，进行变量值替换。
  return postcss([
    easyImport({
      extensions: ['.scss', '.css', '.less']
    }),
    changePlugin(opts)
  ])
    .use(url(urlOption))
    .process(style, { syntax: adapter, from: opts.from, to: opts.to })
}
