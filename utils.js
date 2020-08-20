const fs = require('fs')

 module.exports = {

  createDirs(path) {
    let path_arr = path.split(/[/,\\]/).slice(0, -1)
    path_arr.reduce((prev, curr, idx) => {
      path = idx === 0? curr: `${prev}\\${curr}`
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
      }
      return path
    })
  },
 }

