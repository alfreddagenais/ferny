const fs = require('fs')

function checkFileExists (path) {
  return new Promise((resolve, reject) => {
    fs.access(path, (error) => {
      if (!error) {
        resolve(true)
      } else {
        fs.writeFile(path, '', () => {
          resolve(false)
        })
      }
    })
  })
}

module.exports = checkFileExists
