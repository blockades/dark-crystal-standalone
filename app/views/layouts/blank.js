const nest = require('depnest')
const { h } = require('mutant')

exports.gives = nest('app.views.layouts.blank')

exports.create = (api) => {
  return nest('app.views.layouts.blank', layoutBlank)

  function layoutBlank (request, children = []) {
    return [
      ...children
    ]
  }
}
