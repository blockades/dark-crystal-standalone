const { h, Value, when } = require('mutant')

module.exports = function DarkCrystalRequestNew ({ root, scuttle, recipients = null, name }, callback) {
  // if recipients is null, then all shard holders get a request!
  const rootId = root.key
  const requesting = Value(false)

  return h('div.request', [
    when(requesting,
      h('i.fa.fa-spinner.fa-pulse'),
      h('i.fa.fa-share-square.fa-lg', {
        'title': `Request a shard back from ${name(recipients[0])()} (${recipients[0]}), you cannot undo this action`,
        'ev-click': sendRequest
      })
    )
  ])

  function sendRequest () {
    requesting.set(true)

    scuttle.recover.async.request(rootId, recipients, (err, requests) => {
      requesting.set(false)
      if (err) return callback(err)

      callback(null, requests)
    })
  }
}

// beginnings of a form for when we allow input of body to the request

// function Form (scuttle) {
//   const state = Struct({
//     body: Value()
//   })

//   return h('section.inputs', [
//     h('div.body', [
//       h('label.body', 'Message'),
//       h('input.body', {
//         placeholder: 'Enter your message',
//         value: state.body,
//         'ev-input': (ev) => state.body.set(ev.target.value)
//       })
//     ])
//   ])
// }
