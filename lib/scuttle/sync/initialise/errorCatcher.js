const nest = require('depnest')

exports.gives = nest('app.sync.initialise')

exports.needs = nest({
  'router.sync.router': 'first'
})

exports.create = function (api) {
  return nest('app.sync.initialise', errorCatcher)

  function errorCatcher () {
    // needs to handle errors...

    //     var { container: errorPage, addError } = api.router.sync.router('/errors')
    //     window.addEventListener('error', ev => {
    //       if (!tabs.has('/errors')) tabs.add(errorPage, true)

    //       addError(ev.error || ev)
    //     })
  }
}
