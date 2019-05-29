const fs = require('fs')
const path = require('path')
const h = require('mutant/h')
const compile = require('micro-css')

module.exports = function attachStyles (mcssFiles) {
  if (!Array.isArray(mcssFiles)) return attachStyles([mcssFiles])

  mcssFiles.forEach(file => {
    fs.readFile(path.join(__dirname, '..', file), 'utf8', (err, mcss) => {
      if (err) throw err

      const style = h('style', compile(mcss))
      document.head.appendChild(style)
    })
  })
}
