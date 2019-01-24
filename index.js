const postcss = require('postcss');
const scss = require('postcss-scss');
const less = require('postcss-less');
const changePlugin = require('./postcss-change-vars')
const easyImport = require('postcss-easy-import')
const url = require('postcss-url')
const nodeSass = require('node-sass')
const nodeLess = require('less');

class StyleFile {

  constructor(option) {
    // 默认 option
    const _defaultOption = {
      // easyImport 导入文件后缀
      extensions: ['.scss', '.css', '.less']
    }

    // 合并配置
    this.option = Object.assign(_defaultOption, option)

    // postcss 转换成后的对象 
    this.result = null
  }

  
  /**
   * 根据语言返回  postcss 语法解析器对象
   * @param { string } language - scss/less 语言名称
   * @returns { object } postcss-scss/postcss-less对象
   * @memberof StyleFile
   */
  syntaxAdapter(language) {
    const syntax = {
      scss: scss,
      less: less
    }
    return syntax[language]
  }

  /**
   * 把 scss、less import 导入的代码合并到一个文件上。
   * @param { string } sourceCode - 需要处理的scss、sass、less 变量配置文件源码。
   * @param { object } option - postcss合并参数
   * @param { string } option.language - 所属语言，用于获取当前语言的syntax解析器
   * @param { array } option.extensions - easyImport 识别 import 导入文件的后缀
   * @param { string } option.from - 文件来源路径 必须
   * @param { string } option.to - 文件存储路径 必须
   * @returns Promise<postcsss>
   * @memberof StyleFile
   */
  async mergeStyle(sourceCode, option) {
    // 合并配置，如何没有传递，那么就使用默认配置，如果有传递就使用传递的
    let opts = Object.assign(this.option, option)
    let mergeResult = null

    // 使用 postcss 进行转 import 合并
    try {
      mergeResult = await postcss([
        easyImport({ extensions: opts.extensions })
      ]).process(sourceCode, {
        syntax: this.syntaxAdapter(opts.language),
        from: opts.from,
        to: opts.to
      })
    } catch (err) {
      console.log('mergeStyle 出错了', err)
    }

    return mergeResult
  }

  /**
   * 传入更改的变量，设置变量为新的值。
   * @param { string } sourceCode - 需要处理的scss、sass、less 变量配置文件源码。
   * @param { object } option - 更改变量配置文件
   * @param { string } option.language - 所属语言，用于获取当前语言的syntax解析器
   * @param { string } option.variable - 需要改变的对象，变量名：新值，键值对的形式。
   * @param { string } option.from - 文件来源路径 必须
   * @param { string } option.to - 文件存储路径 必须
   * @returns { object } 返回 postcss 对象
   */
  async changeStyleVar(sourceCode, option) {
    // 合并配置，如何没有传递，那么就使用默认配置，如果有传递就使用传递的
    let opts = Object.assign(this.option, option)
    let changeResult = null

    // 插件配置参数
    let changeVarsOption = {
      language: opts.language,
      variable: { ...opts.variable }
    }
    try {
      changeResult = await postcss([
        changePlugin( changeVarsOption )
      ]).process(sourceCode, {
        syntax: this.syntaxAdapter(opts.language),
        from: opts.from,
        to: opts.to
      })
    } catch (err) {
      console.log('changeStyleVar 出错了', err)
    }

    return changeResult
  }

  
  /**
   * 把 sass、less源码转换成 css
   * @param {string} [sourceCode=''] sass、scss、less字符串源码
   * @param {*} language 所属语言
   * @returns less\sass 对象
   * @memberof StyleFile
   */
  async toCss(sourceCode = '', language) {
    if (language === 'scss') {
      return await this.scssToCss(sourceCode)
    } else if (language === 'less') {
      return await this.lessToCss(sourceCode)
    }

  }

  /**
   * scss 转换成 css 
   * @param {string} [sourceCode=''] scss字符串源码
   * @returns { object } nodeSass 对象
   * @memberof StyleFile
   */
  async scssToCss(sourceCode = '') {
    let renderResult = null
    try {
      renderResult = nodeSass.renderSync({
        data: sourceCode
      })
    } catch (err) {
      console.log('scss转换成css出错', err)
    }
    return renderResult
  }

  /**
   * less 转换成 css 
   * @param {string} [sourceCode='']  less字符串源码
   * @returns { object } nodeLess 对象
   * @memberof StyleFile
   */
  async lessToCss(sourceCode = '') {
    let renderResult = null
    try {
      renderResult = await nodeLess.render(sourceCode)
    } catch (err) {
      console.log('less转换成css出错', err)
    }
    return renderResult
  }
}

module.exports = StyleFile