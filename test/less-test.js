const fs = require('fs');
const path = require('path');
const StyleFile = require('../index');

const style = new StyleFile();

const language = 'less';

async function mergeStyle() {
  const paths = {
    styles: {
      from: 'test/lessTheme/index.less',
      to: 'test/lessTheme/dist/theme.less',
    },
  };
  const scssSourceCode = fs.readFileSync(paths.styles.from);
  const mergeResult = await style.mergeStyle(scssSourceCode, {
    language,
    from: paths.styles.from,
    to: paths.styles.to,
  });
  return mergeResult;
}

// mergeStyle()

async function changeStyleVar() {
  const paths = {
    styles: {
      from: 'test/lessTheme/dist/theme.less',
      to: 'test/lessTheme/dist/theme.less',
    },
  };
  const mergeResult = await mergeStyle();
  const changeResult = await style.changeStyleVar(mergeResult.css, {
    language,
    variable: {
      '@nice-blue': 'blue',
    },
    from: paths.styles.from,
    to: paths.styles.to,
  });
  fs.writeFileSync(paths.styles.to, changeResult.css);
  console.log('done');
}


async function lessToCss() {
  console.time('mind');
  await changeStyleVar();
  const paths = {
    styles: {
      from: 'test/lessTheme/dist/theme.less',
      to: 'test/lessTheme/dist/theme.css',
    },
  };
  const scssSourceCode = fs.readFileSync(paths.styles.from);
  const renderResult = await style.toCss(scssSourceCode.toString(), language);
  fs.writeFileSync(paths.styles.to, renderResult.css);
  console.timeEnd('mind');
}

lessToCss();
