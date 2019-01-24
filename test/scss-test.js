const StyleFile = require('../index')
const fs = require('fs')
const path = require('path')
const style = new StyleFile()


async function mergeStyle() {
  const paths = {
    styles: {
      from: 'test/scssTheme/index.scss',
      to: `test/scssTheme/dist/theme.scss`
    }
  }
  let scssSourceCode = fs.readFileSync(paths.styles.from)
  let mergeResult = await style.mergeStyle(scssSourceCode, {
    language: 'scss',
    from: paths.styles.from,
    to: paths.styles.to
  })
  return mergeResult
}

// mergeStyle()

async function changeStyleVar() {
  const paths = {
    styles: {
      from: `test/scssTheme/dist/theme.scss`,
      to: `test/scssTheme/dist/theme.scss`
    }
  }
  let mergeResult = await mergeStyle()
  let changeResult = await style.changeStyleVar(mergeResult.css, {
    language: 'scss',
    variable: {
      '$--color-white': '#ffffff !default',
      '$--color-black': '#333333 !default',
      '$--font-path': '"/fonts"'
    },
    from: paths.styles.from,
    to: paths.styles.to
  })
  fs.writeFileSync(paths.styles.to, changeResult.css)
  console.log('done')
}



async function scssToCss() {
  console.time('mind')
  // await changeStyleVar()
  const paths = {
    styles: {
      from: `test/scssTheme/dist/theme.scss`,
      to: `test/scssTheme/dist/theme.css`
    }
  }
  let scssSourceCode = fs.readFileSync(paths.styles.from)
  let renderResult = await style.toCss(scssSourceCode.toString(), 'scss');
  fs.writeFileSync(paths.styles.to, renderResult.css)
  console.timeEnd('mind')
}

scssToCss();