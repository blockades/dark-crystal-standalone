const { h, resolve, Value, computed, when } = require('mutant')

const Cropper = require('../../lib/cropper')

module.exports = function AccountEdit (opts) {
  const {
    addBlob,
    avatar,
    name,
    onCancel,
    feedId,
    blobUrl,
    state
  } = opts

  return (
    h('div.account', [
      h('div.personal', [
        h('div.inputs', [
          h('div.avatar', [
            h('label.avatar', 'Avatar'),
            Cropper({ addBlob, image: state.avatar })
          ]),
          h('div.name', [
            h('label.name', 'Name'),
            computed(name(feedId), name => (
              h('input.name', {
                value: name,
                'ev-input': (e) => state.name.set(e.target.value)
              })
            ))
          ])
        ]),
        h('div.current', [
          computed(state.avatar, img => (img ? h('img.avatar', { src: blobUrl(img.link) }) : avatar(feedId, 10)))
        ])
      ])
    ])
  )
}

