const nest = require('depnest')
const { isBlobLink, isFeed, isMsg } = require('ssb-ref')

exports.gives = nest('router.async.normalise')

exports.needs = nest({
  'message.sync.unbox': 'first',
  'sbot.async.get': 'first'
})

exports.create = (api) => {
  return nest('router.async.normalise', normalise)

  function normalise (request, cb) {
    if (typeof request === 'object') {
      cb(null, request)
      return true
    }

    // if someone has given you an annoying html encoded request
    if (request.match(/^%25.*%3D.sha256$/)) {
      request = decodeURIComponent(request)
    }

    if (isMsg(request)) {
      api.sbot.async.get(request, (err, value) => {
        if (err) cb(err)
        else {
          if (typeof value.content === 'string') value = api.message.sync.unbox(value)
          cb(null, { key: request, value })
        }
      })
    }
    else if (isPath(request)) cb(null, { path: request })

    return true
  }
}

function isPath (str) {
  return typeof str === 'string' && str[0] === '/' && str.length > 1
}
