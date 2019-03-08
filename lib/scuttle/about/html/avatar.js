const nest = require('depnest')
const { h, computed } = require('mutant')

exports.gives = nest('about.html.avatar')

exports.needs = nest({
  'about.obs.color': 'first',
  'about.obs.imageUrl': 'first',
  'about.html.link': 'first',
  'router.sync.goTo': 'first'
})

exports.create = function (api) {
  return nest('about.html.avatar', avatar)

  function avatar (id, size = 4) {
    const src = api.about.obs.imageUrl(id)
    const color = computed(src, src => src.match(/^http/) ? 'rgba(0,0,0,0)' : api.about.obs.color(id))

    const avatar = computed(src, src => (
      h('div.img', {
        style: { padding: `0 0 0 ${size / 8}rem` }
      }, [
        h('img', {
          src,
          classList: ['Avatar'],
          style: {
            height: isNaN(size) ? size : `${size}rem`,
            width: isNaN(size) ? size : `${size}rem`,
            'background-color': color
          },
          'ev-click': () => api.router.sync.goTo({ path: `/peers/${id}`, peer: { id } })
        })
      ])
    ))

    return avatar
  }
}
