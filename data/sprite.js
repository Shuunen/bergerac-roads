const nsg = require('node-sprite-generator')
const isInstalled = require('is-installed')

function createPngSprite() {
  nsg({
    compositor: 'jimp', // jimp
    compositorOptions: { compressionLevel: 6 },
    src: ['assets/icons/**/*.png'],
    layout: 'packed',
    spritePath: 'assets/images/icons.png',
    stylesheet: 'scss',
    stylesheetPath: 'assets/styles/ressources/icons-transparent.scss',
    stylesheetOptions: { prefix: 'transparent-' },
  }, function(err) {
    if (err) {
      console.log('Sprite PNG failed !', err)
    } else {
      showHints('png')
    }
  })
}

function showHints(type) {
  console.log(`Sprite ${type} generated!`)
  console.log('TODO : Upload sprite to CDN')
  console.log(`TODO : Background should target "#{$cdn}/images/icons.${type}" in icons${type === 'jpg' ? '' : '-transparent'}.scss`)
  console.log('TODO : Specify "background-size: 1234px;" under "@mixin sprite($sprite)"')
  console.log('TODO : Invalidate https://admin-v3.cloudimg.io/admin/project/invalidation')
  console.log(`URL : /cdn/none/none/bergerac.lebowsky-dev.xyz/images/icons.${type}`)
}

function createJpgSprite() {
  nsg({
    compositor: 'gm', // jimp
    compositorOptions: { compressionLevel: 7 },
    src: ['assets/icons/**/*.jpg'],
    layout: 'packed',
    spritePath: 'assets/images/icons.jpg',
    stylesheet: 'scss',
    stylesheetPath: 'assets/styles/ressources/icons.scss',
  }, function(err) {
    if (err) {
      console.log('Sprite JPG failed !', err)
    } else {
      showHints('jpg')
    }
  })
}

function startJpgSprite() {
  if (isInstalled.sync('gm')) {
    createJpgSprite()
  } else {
    console.log('Error : ImageMagick/GraphicsMagick needs to be installed when using the gm compositor')
  }
}

startJpgSprite()
createPngSprite()
