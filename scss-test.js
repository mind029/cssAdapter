const StyleFile = require('./adapter')
const fs = require('fs')
const path = require('path')
const style = new StyleFile({
  language: 'scss',
  from: 'test/scssTheme/index.scss',
  to: 'test/scssTheme/dist/theme.css'
})


let styleCss = fs.readFileSync('./test/scssTheme/index.scss')
let variable = {
  '$--color-white': '#fff'
}

async function start() {
  console.time('vic')
  await style.changeVars(styleCss, variable)
  let renderCssResult = await style.toCss()
  // assetsPath 生成静态资源文件目录
  const urlOption = [
    { filter: /\.ttf$/, url: 'copy', useHash: true, assetsPath: path.resolve('test','scssTheme', 'dist','fonts') },
    { filter: /\.woff$/, url: 'copy', useHash: true, assetsPath: path.resolve('test','scssTheme', 'dist','fonts') }
  ]
  let rs = await style.postcssUrl(renderCssResult.css, urlOption)
  fs.writeFileSync(path.resolve('test','scssTheme','dist') + '/theme.css', rs.css)
  console.timeEnd('vic')
}

start()