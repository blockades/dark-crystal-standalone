const { h } = require('mutant')
const getContent = require('ssb-msg-content')
const sort = require('ssb-sort')

const Recipient = require('../../component/recipient')
const Timestamp = require('../../component/timestamp')
const getRecp = require('../../lib/get-recp')
const RequestNew = require('../requests/new')

module.exports = function DarkCrystalShardsRecord ({ root, record, scuttle, name, avatar, msg }) {
  const { shard, requests, replies } = record

  const recp = getRecp(shard)
  const recoveryHistory = sort([...requests, ...replies])

  return h('DarkCrystalShardsRecord', [
    h('div.author', [
      Recipient({ recp, avatar })
    ]),
    h('div.history', [
      h('div.historyItem', [
        h('div.action', [
          h('i.fa.fa-arrow-right'),
          h('i.fa.fa-diamond'),
          'shard sent'
        ]),
        Timestamp({ timestamp: shard.value.timestamp })
      ]),
      recoveryHistory.map(msg => {
        const { type } = getContent(msg)

        switch (type) {
          case 'invite':
            return h('div.historyItem', [
              h('div.action', [
                h('i'),
                h('i'),
                'requested return'
              ]),
              Timestamp({ timestamp: msg.value.timestamp })
            ])

          case 'invite-reply':
            return h('div.historyItem', [
              h('div.action -shard-return', [
                h('i.fa.fa-diamond'),
                h('i.fa.fa-arrow-left'),
                'returned'
              ]),
              Timestamp({ timestamp: msg.timestamp }) // received time matters more here
            ])
        }
      })
    ]),
    replies.length
      ? ''
      : RequestNew({ root, scuttle, recipients: [recp], name }, console.log)
  ])
}
