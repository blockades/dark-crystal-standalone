const path = require('path')
const { basename  } = path
const readDirectory = require('read-directory')
const { each  } = require('libnested')
const nest = require('depnest')

const contents = readDirectory.sync(path.join(__dirname, '..'), {
  extensions: false,
  filter: '**/*.mcss',
  ignore: ['router/**', 'actions/**']
})

exports.gives = nest('styles.mcss')

exports.create = function (api) {
  return nest('styles.mcss', mcss)

  function mcss (acc = {}) {
    each(contents, (content, [filename]) => {
      acc[filename] = content
    })

    return acc
  }
}
