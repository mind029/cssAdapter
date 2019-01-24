# postcss-easy-tools

1. 合并 scss、less 主题到一个文件
2. 传入对象，更改主题的变量 为传入的新值
3. 转换成 scss、less 到 css

详细用法请查看 test里面的示例。

## 安装：

```shell

npm install postcss-easy-tools --save

```

## 用法

合并主题代码：

```js
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


```
