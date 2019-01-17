# cssAdapter
To change the value of the sass or less variable

用于改变 scss、less、sass等样式文件的变量。

## 用法

```
const changeVars = require('change-style-vars')

let lessStyle = `
@nice-blue: #5B83AD;
@light-blue: @nice-blue + #111;
`

let lessOpts = {
  "language": "less",
  "variable": {
    "@nice-blue": "red"
  }
}

let scssStyle = `
$--color-success: #67c23a !default;
$--color-warning: #e6a23c !default;
$--color-danger: #f56c6c !default;
$--color-info: #909399 !default;
`

let scssOpts = {
  "language": "scss",
  "variable": {
    "$--color-success": "red"
  }
}

async function start() {
  let lessResult = await changeVars(lessStyle, lessOpts)
  console.log(lessResult.css)

  let scssResult = await changeVars(scssStyle, scssOpts)
  console.log(scssResult.css)
}

start()

```

## 如何转换成 css

调用 node-sass、less.js 转换成 css
