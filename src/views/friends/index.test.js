// run this with electro:
// npx electro views/others-shards/index.test.js
//
// NOTE - currently not in working order
//
// PROBLEM - if you run server.createFeed(), this doesn't have access to installed plugins...
// pull(
//   pull.values(shards),
//   pull.map(name => {
//     return {type: 'dark-crystal/root', version: '1.0.0', name, recps: [server.id]}
//   }),
//   pull.asyncMap((content, cb) => server.private.publish(content, content.recps, cb)),
//   pull.collect((err, data) => {
//     console.log(err, data)
//   })
// )

// const pull = require('pull-stream')
const Scuttle = require('scuttle-dark-crystal')

const Server = require('../lib/testbot')
const attachStyles = require('../lib/attachStyles')
const viewName = 'index'
const View = require(`./${viewName}`)

const server = Server()

runRitual(server, console.log)

// publish some dark-crystal/roots !
// const shards = [ 'ABC.box', '010101.box', 'asdaslkjasd.box' ]

const opts = {
  scuttle: Scuttle(server)
}

document.body.appendChild(View(opts))

attachStyles([
  `${viewName}.mcss`
])

function runRitual (server, cb) {
  var peer = server.createFeed()

  peer.private = server.private
  peer.query = server.query
  peer.backlinks = server.backlinks

  Scuttle(peer).share.async.share({
    name: 'lil crystal',
    secret: 'never shall you know',
    quorum: 2,
    recps: [server.id, '@ye+QM09iPcDJD6YvQYjoQc7sLF/IFhmNbEqgdzQo3lQ=.ed25519']
  }, cb)
}
