const postcss = require('postcss');
const scss = require('postcss-scss');
const less = require('postcss-less');
const changePlugin = require('./postcss-change-vars')
const easyImport = require('postcss-easy-import')
const url = require('postcss-url')
const nodeSass = require('node-sass')
const nodeLess = require('less');

class StyleFile {

  /**
   * 初始化数据
   * @param { language: 'scss', extensions: ['']  } option
   *  language: 'scss', 所属语言
   *  extensions: [''] easyImport 合并 @import 匹配后缀
   * 
   */
  constructor(option) {

    // 默认 option
    const defaultOption = {
      language: 'scss',
      extensions: ['.scss', '.css', '.less'],
      from: '',
      to: ''
    }

    // 合并配置
    this.option = Object.assign(defaultOption, option)

    // postcss 转换成后的对象 
    this.result = null
  }

  get syntaxAdapter() {
    const syntax = {
      scss: scss,
      less: less
    }
    return syntax[this.option.language]
  }

  /**
   * 
   * @param {*} style scss、less 样式文件。
   * @param {*} option { 
   *  
   * }
   */
  async changeVars(style, variable) {
    let {
      language,
      from,
      extensions,
      to
    } = this.option

    let changeVarsOption = {
      language: language,
      variable: { ...variable }
    }

    // 使用 postcss 进行转 import 合并及变量替换
    try {
      this.result = await postcss([
        easyImport({
          extensions: extensions
        }),
        changePlugin(changeVarsOption)
      ]).process(style, { syntax: this.syntaxAdapter, from: from, to: to })
    } catch (err) {
      console.log('changeVars 出错了', err)
    }

    return this.result
  }


  /**
   * 使用 postcss-url 处理静态资源
   * @param {*} cssStyle 样式文件
   * @param {*} urlOption postcss-url 配置
   */
  async postcssUrl(cssStyle = this.toCss(), urlOption) {
    let result = null
    let {
      from, to
    } = this.option
    try {
      result = await postcss()
        .use(url(urlOption))
        .process(cssStyle, {
          from,
          to
        })
    } catch (err) {
      console.log('url()处理出错', err)
    }

    return result
  }

  /**
   * 返回 css 样式文件
   * @param {*} cssStyle 需要转换的预处理样式。less、scss、sass等
   */
  async toCss(cssStyle = this.result && this.result.css) {
    let {
      language
    } = this.option

    if (language === 'scss') {
      return await this.scssToCss(cssStyle)
    }else if (language === 'less') {
      return await this.lessToCss(cssStyle)
    }

  }

  async scssToCss(cssStyle) {
    let renderResult = null
    try {
      renderResult = nodeSass.renderSync({
        data: cssStyle
      })
    } catch (err) {
      console.log('scss转换成css出错', err)
    }
    return renderResult
  }

  async lessToCss(cssStyle) {
    let renderResult = null
    try {
      renderResult = await nodeLess.render(cssStyle)
    } catch (err) {
      console.log('less转换成css出错', err)
    }
    return renderResult
  }

}

module.exports = StyleFile