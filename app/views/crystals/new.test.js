// run this with electro:
// npx electro views/new.test.js

const attachStyles = require('../lib/attachStyles')

const viewName = 'new'
const View = require(`./${viewName}`)

const opts = {
  scuttle: {
    share: {
      async: {
        share: (opts, cb) => setTimeout(
          () => {
            console.log('Dummy ritual!', opts)
            cb(null, opts)
          },
          1000
        )
      }
    }
  },
  suggest: {
    about: () => {}
  },
  avatar: i => i,
  i18n: i => i
}

document.body.appendChild(View(opts))

attachStyles([
  `${viewName}.mcss`,
  'component/recipients.mcss'
])
