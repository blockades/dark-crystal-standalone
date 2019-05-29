const nest = require('depnest')
const { merge } = require('lodash')
const fs = require('fs')
const { join } = require('path')

exports.gives = nest('app.sync.initialise')

exports.needs = nest({
  'settings.sync.set': 'first',
  'settings.sync.get': 'first'
})

const defaults = {
  app: {
    accessibility: {
      invert: false,
      saturation: 100,
      brightness: 100,
      contrast: 100
    }
  },
}

exports.create = function (api) {
  return nest('app.sync.initialise', initialiseSettings)

  function initialiseSettings () {
    const { get, set } = api.settings.sync
    const settings = merge({}, defaults, get())

    set(settings)
  }
}

