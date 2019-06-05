// run this with electro:
// npx electro views/index.test.js

const pull = require('pull-stream')
const Scuttle = require('scuttle-dark-crystal')

const Server = require('./lib/testbot')
const attachStyles = require('./lib/attachStyles')
const viewName = 'show'
const View = require(`./${viewName}`)
const getContent = require('ssb-msg-content')

const server = Server()
const scuttle = Scuttle(server)

let params = {
  name: 'MMT longterm wallet',
  secret: 'test',
  recps: [server.createFeed().id, server.createFeed().id],
  quorum: 2
}

scuttle.share.async.share(params, (err, data) => {
  if (err) throw err

  const { root, ritual, shards } = data
  console.log(['ROOT DETAILS:', 'ID', root.key, 'NAME', root.value.content.name].join(' '))
  console.log(['RITUAL DETAILS:', 'ID', ritual.key, 'QUORUM', ritual.value.content.quorum].join(' '))
  console.log(['SHARDS:', 'IDS', shards.map(s => s.key).join(' | ')].join(' '))

  console.log('PRE-POPULATED DATABASE')

  document.body.appendChild(View({
    scuttle,
    root,
    avatar: () => {},
    modal: () => {}
  }))

  console.log('VIEW APPENDED')

  pull(
    pull.values(shards),
    pull.through(s => console.log),
    pull.map(shard => {
      const { root, recps = [] } = getContent(shard)
      return {
        type: 'invite',
        version: '1',
        recps: recps,
        root: root,
        body: 'gimme gimme gimme'
      }
    }),
    pull.asyncMap((shard, callback) => {
      scuttle.recover.async.request(root.key, shard.recps, (err, request) => {
        if (err) throw err

        console.log(request)
        callback(null, server.private.unbox(request))
      })
    }),
    pull.drain(request => {
      console.log(request)
    })
  )
})

attachStyles([
  `${viewName}.mcss`
])
