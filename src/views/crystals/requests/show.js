const { h } = require('mutant')

const Timestamp = require('../../component/timestamp')

module.exports = function DarkCrystalRequestShow ({ root, scuttle, msg }) {
  if (!msg) throw new Error('missing request')

  const { timestamp } = msg.value

  return h('div.request', [
    Timestamp({
      prefix: 'Requested on',
      timestamp: timestamp
    })
  ])
}
