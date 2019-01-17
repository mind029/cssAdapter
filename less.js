const less = require('less');

let str = `
@nice-blue: #5B83AD;
@light-blue: @nice-blue + #111;
.my-btn {
  color: @nice-blue;
}
`

