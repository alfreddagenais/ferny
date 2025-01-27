const fs = require('fs')
const ppath = require('persist-path')('Ferny')
const { join } = require('path')

const checkFileExists = require(join(__dirname, '/checkFileExists.js'))

function checkDirExists (path) {
  return new Promise((resolve, reject) => {
    fs.access(path, (error) => {
      if (!error) {
        resolve()
      } else {
        fs.mkdir(path, (err) => {
          if (!err) {
            resolve()
          }
        })
      }
    })
  })
}

function loadFileFromJsonFolder (subfolder, fileName) {
  return new Promise((resolve, reject) => {
    checkDirExists(ppath).then(() => {
      checkDirExists(ppath + '/json').then(() => {
        if (subfolder == null) {
          checkFileExists(ppath + '/json/' + fileName + '.json').then(() => {
            fs.readFile(ppath + '/json/' + fileName + '.json', (err, data) => {
              if (!err) {
                resolve(data)
              }
            })
          })
        } else {
          checkDirExists(ppath + '/json/' + subfolder).then(() => {
            checkFileExists(ppath + '/json/' + subfolder + '/' + fileName + '.json').then(() => {
              fs.readFile(ppath + '/json/' + subfolder + '/' + fileName + '.json', (err, data) => {
                if (!err) {
                  resolve(data)
                }
              })
            })
          })
        }
      })
    })
  })
}

module.exports = loadFileFromJsonFolder
