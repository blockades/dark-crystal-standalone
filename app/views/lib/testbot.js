module.exports = function (opts) {
  return require('scuttle-testbot')
    .use(require('ssb-private'))
    .use(require('ssb-query'))
    .use(require('ssb-backlinks'))
    .call(opts)
}
