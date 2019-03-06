const nest = require('depnest')
const pull = require('pull-stream')
const { clipboard } = require('electron')
const { h, computed, Value } = require('mutant')

const NavBar = require('../../components/NavBar')
const ViewTabs = require('../../components/ViewTabs')
exports.gives = nest('app.views.secrets.show')

exports.needs = nest({
  'router.sync.goTo': 'first',
  'router.sync.goBack': 'first',
  'about.html.avatar': 'first'
})

exports.create = (api) => {
  return nest('app.views.secrets.show', secretsShow)

  function secretsShow (request) {
    const { secret } = request

    // %%TODO%% I'd like it if we could remove this from these views and it just gets passed a state object...
    // That way our views are much more like components, and our state can be determined higher up,
    // in 'containers' or 'controllers'
    const hidden = Value('hidden')

    return h('Secrets -show', [
      h('div.left', [
        h('i.fa.fa-chevron-left', {
          'ev-click': api.router.sync.goBack
        }),
      ]),
      h('div.main', [
        h('section.details', [
          h('div.local', [
            h('div.image', [
              h('i.fa.fa-picture-o.fa-5x')
            ]),
            h('div.name', [
              h('span.name', secret.name)
            ]),
          ]),
          h('div.remote', [
            h('div.custodians', secret.recipients.map(feedId => api.about.html.avatar(feedId, 2))),
          ])
        ]),
        h('section.secret', [
          h('div.container', [
            h('div.down', [
              h('i.fa.fa-chevron-down', { 'ev-click': () => hidden.set(hidden() === 'hidden' ? '' : 'hidden') }),
            ]),
            h('div.secret', [
              h('textarea', {
                classList: computed(hidden, (hidden) => hidden),
                placeholder: 'secret placeholder',
                attributes: { readonly: true }
              }, secret.secret)
            ])
          ]),
          h('div.actions', [
            h('i.fa.fa-clipboard.fa-lg', { 'ev-click': clipboard.write(secret) }),
            h('button', 'Reset')
          ])
        ])
      ])
    ])
  }
}
