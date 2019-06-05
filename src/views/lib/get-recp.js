const getContent = require('ssb-msg-content')

module.exports = function getRecp (shard) {
  return getContent(shard).recps
    .find(r => r !== shard.value.author)
}
