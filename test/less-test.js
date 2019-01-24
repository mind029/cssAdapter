const StyleFile = require('../index')
const fs = require('fs')
const path = require('path')
const style = new StyleFile()

const language = 'less'

async function mergeStyle() {
  const paths = {
    styles: {
      from: 'test/lessTheme/index.less',
      to: `test/lessTheme/dist/theme.less`
    }
  }
  let scssSourceCode = fs.readFileSync(paths.styles.from)
  let mergeResult = await style.mergeStyle(scssSourceCode, {
    language: language,
    from: paths.styles.from,
    to: paths.styles.to
  })
  return mergeResult
}

// mergeStyle()

async function changeStyleVar() {
  const paths = {
    styles: {
      from: `test/lessTheme/dist/theme.less`,
      to: `test/lessTheme/dist/theme.less`
    }
  }
  let mergeResult = await mergeStyle()
  let changeResult = await style.changeStyleVar(mergeResult.css, {
    language: language,
    variable: {
      '@nice-blue': 'blue'
    },
    from: paths.styles.from,
    to: paths.styles.to
  })
  fs.writeFileSync(paths.styles.to, changeResult.css)
  console.log('done')
}



async function lessToCss() {
  console.time('mind')
  await changeStyleVar()
  const paths = {
    styles: {
      from: `test/lessTheme/dist/theme.less`,
      to: `test/lessTheme/dist/theme.css`
    }
  }
  let scssSourceCode = fs.readFileSync(paths.styles.from)
  let renderResult = await style.toCss(scssSourceCode.toString(), language);
  fs.writeFileSync(paths.styles.to, renderResult.css)
  console.timeEnd('mind')
}

lessToCss();