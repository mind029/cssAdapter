const postcss = require('postcss');
const postcssUrl = require('postcss-url');
const scss = require('postcss-scss');
const less = require('postcss-less');
const easyImport = require('postcss-easy-import');
const nodeSass = require('node-sass');
const nodeLess = require('less');

const changePlugin = require('./postcss-change-vars');

class Style {
  /**
   * 构造函数
   * @param { * } option
   * @param { string } option.language - 所属语言，用于获取当前语言的syntax解析器
   * @param { array } option.extensions - easyImport 识别 import 导入文件的后缀
   */
  constructor(option) {
    // 默认 option
    const defaultOption = {
      language: 'scss',
      extensions: ['.scss', '.css', '.less'], // easyImport 导入文件后缀
    };

    // 合并配置
    this.option = { ...defaultOption, ...option };
  }

  /**
   * @description 根据语言返回  postcss 语法解析器对象
   * @param {*} [language=this.option.language] scss/sass/less
   * @returns postcss-scss/postcss-less对象
   * @memberof Style
   */
  syntaxAdapter(language = this.option.language) {
    const syntax = {
      scss,
      less,
    };
    return syntax[language];
  }

  /**
   * @description 把 scss、less、sass 文件中的 import 导入的代码合并到一个文件上。
   * @param { string } sourceCode - 待合并文件的源码。
   * @param { string } from - sourceCode的路径。
   * @param { string } to - 合并后文件的路径。
   * @returns 合并结果
   * @memberof Style
   */
  async mergeStyle(sourceCode, from, to) {
    // TODO: 后续需要做参数校验
    // TODO: 后续需要使用postcss-url插件进行静态资源处理。
    // 合并配置，如何没有传递，那么就使用默认配置，如果有传递就使用传递的
    const option = { ...this.option };
    const mergeRes = {
      status: true,
      message: '合并成功',
      res: null,
    };

    // 使用 postcss-easy-import 进行合并
    try {
      const importRes = await postcss([
        easyImport({ extensions: option.extensions }),
      ]).process(sourceCode, {
        syntax: this.syntaxAdapter(),
        from,
        to,
      });
      mergeRes.res = importRes;
    } catch (err) {
      mergeRes.status = false;
      mergeRes.message = err.message;
    }

    return mergeRes;
  }

  /**
   * @description 传入更改的变量，设置变量为新的值。
   * @param { object } option - 更新所需配置参数
   * @param { string } option.code - 需要处理的scss、sass、less 变量配置文件源码。
   * @param { string } option.variable - 需要改变的对象，变量名：新值，键值对的形式。
   * @param { string } option.from -  文件来源路径
   * @param { string } option.to -  文件存储路径 必须
   * @returns 更新结果，如果成功包含 postcss 对象
   * @memberof Style
   */
  async updateStyle(option) {
    // TODO: 后续需要完善参数验证。
    const styleOption = { ...this.option };
    const updateRes = {
      status: true,
      message: '更新样式变量成功',
      res: null,
    };

    // 插件配置参数
    const changePluginOption = {
      language: styleOption.language,
      variable: { ...option.variable },
    };
    try {
      const updateResult = await postcss([
        changePlugin(changePluginOption),
      ]).process(option.code, {
        syntax: this.syntaxAdapter(),
        from: option.from,
        to: option.to,
      });
      updateRes.res = updateResult;
    } catch (err) {
      updateRes.status = false;
      updateRes.message = err.message;
    }

    return updateRes;
  }

  /**
   * @description 把 sass、less源码转换成 css
   * @param {string} [sourceCode=''] - 源码
   * @param {*} [language=this.option.language] - 所属语言
   * @returns 渲染结果
   * @memberof Style
   */
  async renderStyle(sourceCode = '', language = this.option.language) {
    // TODO: 参数校验。
    let code = '';
    if (Buffer.isBuffer(sourceCode)) {
      code = sourceCode.toString();
    } else {
      code = sourceCode;
    }
    const renderRes = {
      status: true,
      message: '渲染成功',
      res: null,
    };

    if (language === 'scss') {
      const sassResult = await this.renderScss(code);
      return sassResult;
    } if (language === 'less') {
      const lessResult = await this.renderLess(code);
      return lessResult;
    }
    return renderRes;
  }

  /**
   * @description 把 scss 转换成 css
   * @param {string} [sourceCode=''] scss字符串源码
   * @returns { object } 渲染结果，如果成功，则包含 nodeSass对象
   * @memberof StyleFile
   */
  async renderScss(sourceCode = '') {
    // TODO: 参数校验
    const renderResult = {
      status: true,
      message: '渲染成功',
      res: null,
    };
    try {
      renderResult.res = nodeSass.renderSync({
        data: sourceCode,
      });
    } catch (err) {
      renderResult.status = false;
      renderResult.message = err.message;
    }
    return renderResult;
  }

  /**
   * @description 把 less 转换成 css
   * @param {string} [sourceCode='']  less字符串源码
   * @returns { object } nodeLess 对象
   * @memberof StyleFile
   */
  async renderLess(sourceCode = '') {
    // TODO: 参数校验
    const renderResult = {
      status: true,
      message: '渲染成功',
      res: null,
    };
    try {
      renderResult.res = await nodeLess.render(sourceCode);
    } catch (err) {
      renderResult.status = false;
      renderResult.message = err.message;
    }
    return renderResult;
  }

  async parse(
    sourceCode,
    from = this.option.from,
    to = this.option.to,
    language = this.option.language,
  ) {
    const parseRes = {
      status: true,
      message: '解析成功',
      res: null,
    };
    try {
      const postcssRes = await postcss().process(sourceCode, {
        syntax: this.syntaxAdapter(language),
        from,
        to,
      });
      parseRes.res = postcssRes;
    } catch (err) {
      parseRes.status = false;
      parseRes.message = err.message;
      parseRes.res = null;
    }
    return parseRes;
  }

  /**
   * @description 更改样式静态资源路径
   * @param { object } param
   * @param { string } param.code 代码
   * @param { string } param.from 文件源路径
   * @param { string } param.to 目标路径
   * @param { string } param.option 配置
   * @returns
   * @memberof Style
   */
  async resetUrl(param) {
    const resetRes = {
      status: true,
      message: '重置成功',
      res: null,
    };

    const {
      code,
      from,
      to,
      option,
    } = param;

    try {
      const postcssRes = await postcss()
        .use(postcssUrl(option))
        .process(code, {
          from,
          to,
        });
      resetRes.res = postcssRes;
    } catch (err) {
      resetRes.status = false;
      resetRes.message = err.message;
    }

    return resetRes;
  }
}

module.exports = Style;
