const { h, Value, when, resolve } = require('mutant')
const { clipboard } = require('electron')

module.exports = function CopyToClipboard (opts) {
  const { toCopy = Value() } = opts
  const btnVisible = Value(true)

  return h('div.copy', [
    when(btnVisible,
      h('button -primary', { 'ev-click': copy }, [
        h('i.fa.fa-copy'),
        'Copy to clipboard'
      ]),
      h('button', `(ﾉ´ヮ´)ﾉ*:･ﾟ✧`)
    )
  ])

  function copy () {
    btnVisible.set(false)
    clipboard.writeText(resolve(toCopy))

    setTimeout(() => btnVisible.set(true), 500)
  }
}
