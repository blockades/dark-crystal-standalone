const dataurl = require('dataurl-')
const hyperfile = require('hyperfile')
const hypercrop = require('hypercrop')
const hyperlightbox = require('hyperlightbox')
const pull = require('pull-stream')
const { h, Value, when } = require('mutant')

module.exports = function Cropper (opts) {
  const {
    addBlob,
    image,
    width = 100,
    height = 100
  } = opts

  var lightbox = hyperlightbox()

  return h('Cropper', [
    lightbox,
    hyperfile.asDataURL((url) => {
      lightbox.show(
        Crop(url, (err, cropper) => {
          if (err) throw err
          if (!cropper) return lightbox.close()

          var _data = dataurl.parse(cropper)

          addBlob(pull.once(_data.data), (err, hash) => {
            if (err) throw err

            image.set({
              link: hash,
              size: _data.data.length,
              type: _data.mimetype,
              width,
              height
            })
          })
          lightbox.close()
        })
      )
    })
  ])
}

function Crop (src, callback) {
  var image = h('img', { src })
  var crop = Value()

  loadImage()

  return h('div.canvas', [
    when(crop, crop, h('i.fa.fa-spinner.fa-pulse')),
    h('div.background')
  ])

  function loadImage () {
    if (!image.height && !image.width) return setTimeout(loadImage, 100)
    var canvas = hypercrop(image)

    crop.set(
      h('div.crop', [
        h('label.crop', 'Click and drag to crop your avatar'),
        canvas,
        h('section.actions', [
          h('button -subtle', { 'ev-click': () => callback() }, 'Cancel'),
          h('button -primary', { 'ev-click': () => callback(null, canvas.selection.toDataURL()) }, 'OK')
        ])
      ])
    )
  }
}
