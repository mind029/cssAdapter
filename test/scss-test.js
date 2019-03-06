const fs = require('fs');
const StyleFile = require('../src/index');

const style = new StyleFile();


// async function mergeStyle() {
//   const paths = {
//     styles: {
//       from: 'test/scssTheme/index.scss',
//       to: 'test/scssTheme/dist/theme.scss',
//     },
//   };
//   const scssSourceCode = fs.readFileSync(paths.styles.from);
//   const mergeResult = await style.mergeStyle(scssSourceCode, {
//     language: 'scss',
//     from: paths.styles.from,
//     to: paths.styles.to,
//   });
//   return mergeResult;
// }

// mergeStyle()

// async function changeStyleVar() {
//   const paths = {
//     styles: {
//       from: 'test/scssTheme/dist/theme.scss',
//       to: 'test/scssTheme/dist/theme.scss',
//     },
//   };
//   const mergeResult = await mergeStyle();
//   const changeResult = await style.changeStyleVar(mergeResult.css, {
//     language: 'scss',
//     variable: {
//       '$--color-white': '#ffffff !default',
//       '$--color-black': '#333333 !default',
//       '$--font-path': '"/fonts"',
//     },
//     from: paths.styles.from,
//     to: paths.styles.to,
//   });
//   fs.writeFileSync(paths.styles.to, changeResult.css);
//   console.log('done');
// }


// async function scssToCss() {
//   console.time('mind');
//   // await changeStyleVar()
//   const paths = {
//     styles: {
//       from: 'test/scssTheme/dist/theme.scss',
//       to: 'test/scssTheme/dist/theme.css',
//     },
//   };
//   const scssSourceCode = fs.readFileSync(paths.styles.from);
//   const renderResult = await style.toCss(scssSourceCode.toString(), 'scss');
//   fs.writeFileSync(paths.styles.to, renderResult.css);
//   console.timeEnd('mind');
// }

// scssToCss();


async function copyAssets() {
  const filePath = '/Users/mind/development/code/Git/Github/cssAdapter/test/scssTheme/dist/theme123.css';
  const code = fs.readFileSync('/Users/mind/development/code/Git/Github/cssAdapter/test/scssTheme/dist/theme123.css').toString();
  const res = await style.resetUrl({
    code,
    from: filePath,
    to: filePath,
    option: {},
  });
  fs.writeFileSync('/Users/mind/development/code/Git/Github/cssAdapter/123.css', res.res.css);
  return 1;
}

copyAssets();
