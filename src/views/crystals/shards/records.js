const { h, computed } = require('mutant')
const ShardsRecord = require('./record')

module.exports = function DarkCrystalShardsRecords (opts) {
  const {
    root,
    records,
    scuttle,
    avatar,
    name
  } = opts

  return h('DarkCrystalShardsRecords', [
    h('h3', 'History'),
    h('div.records', [
      computed(records, records => {
        return records.map(record => {
          return ShardsRecord({
            root,
            record,
            scuttle,
            name,
            avatar
          })
        })
      })
    ])
  ])
}
