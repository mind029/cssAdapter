const StyleFile = require('./adapter')
const fs = require('fs')
const path = require('path')
const style = new StyleFile({
  language: 'less',
  from: 'test/lessTheme/index.less',
  to: 'test/lessTheme/dist/theme.css'
})

let styleCss = fs.readFileSync('./test/lessTheme/index.less')
let variable = {
}

async function start() {
  await style.changeVars(styleCss, variable)
  let renderCssResult = await style.toCss()
  // assetsPath 生成静态资源文件目录
  const urlOption = [
    { filter: /\.ttf$/, url: 'copy', useHash: true, assetsPath: path.resolve('test','lessTheme','dist','fonts') },
    { filter: /\.woff$/, url: 'copy', useHash: true, assetsPath: path.resolve('test','lessTheme','dist','fonts') }
  ]
  let rs = await style.postcssUrl(renderCssResult.css, urlOption)
  fs.writeFileSync(path.resolve('test','lessTheme','dist') + '/theme.css', rs.css)
}

start()