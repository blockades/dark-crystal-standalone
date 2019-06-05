const nest = require('depnest')
const { h, computed } = require('mutant')

const CopyToClipboard = require('../../../components/CopyToClipboard')
const Avatar = require('../../../components/Avatar')

exports.gives = nest('views.settings.account.index')

exports.needs = nest({
  'keys.sync.id': 'first',
  'about.obs.name': 'first',
  'message.async.publish': 'first',
  'about.obs.imageUrl': 'first',
  'sbot.async.addBlob': 'first',
  'sbot.obs.localPeers': 'first'
})

exports.create = (api) => {
  return nest('views.settings.account.index', settingsAccountIndex)

  function settingsAccountIndex (request) {
    const id = api.keys.sync.id()
    const name = api.about.obs.name(id)

    return h('Settings Account -index', [
      h('section.setting', [
        Avatar({
          id,
          size: 6,
          imageUrl: api.about.obs.imageUrl
        })
      ]),
      h('section.setting', [
        h('span.id', 'ID: '),
        h('input', { attributes: { readonly: true }, value: id }),
        CopyToClipboard({ value: id })
      ]),
      h('section.setting', [
        h('span.id', 'Name: '),
        h('input', { value: name }),
        CopyToClipboard({ value: name })
      ]),
    ])
  }
}
