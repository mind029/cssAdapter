const postcss = require('postcss')

module.exports = postcss.plugin('postcss-change-vars', function (opts) {
  opts = opts || {}

  // Work with options here ，对传入的对象设置为新的值
  return function (root, result) {
    // Transform CSS AST here
    root.walk((node) => {
      // less、scss对应变量的名
      let key = ''

      // less、scss变量名对应名称不同，要区别处理
      if (opts.language === 'less') {
        key = `@${node.name}`
      } else if (opts.language === 'scss') {
        key = node.prop
      }

      // 设置传入 value 为 node 的 value
      if (opts.variable[key]) {
        node.value = opts.variable[key]        
      }

    })
  }
})