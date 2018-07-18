import nsg from 'node-sprite-generator'

/*
nsg({
  compositor: 'jimp', // jimp
  compositorOptions: {
    compressionLevel: 6
  },
  src: [
    'assets/icons/**//* \.png',
  ],
  layout: 'packed', // packed
  spritePath: 'assets/images/icons.png',
  stylesheet: 'scss',
  stylesheetPath: 'assets/styles/ressources/icons-transparent.scss',
  stylesheetOptions: {
    prefix:'transparent-'
  }
}, function(err) {
  if (err) {
    console.log('Sprite PNG failed !', err)
  } else {
    console.log('Sprite PNG generated!')
  }
})
*/

nsg({
  compositor: 'gm', // jimp
  compositorOptions: {
    compressionLevel: 7
  },
  src: [
    'assets/icons/**/*.jpg',
  ],
  layout: 'packed', // packed
  spritePath: 'assets/images/icons.jpg',
  stylesheet: 'scss',
  stylesheetPath: 'assets/styles/ressources/icons.scss'
}, function(err) {
  if (err) {
    console.log('Sprite JPG failed !', err)
  } else {
    console.log('Sprite JPG generated!')
    console.log('TODO : Upload sprite to CDN')
    console.log('TODO : Background should target "#{$cdn}/images/icons.jpg" in icons.scss')
    console.log('TODO : Invalidate https://admin-v3.cloudimg.io/admin/project/invalidation')
    console.log('URL : /cdn/none/none/bergerac.lebowsky-dev.xyz/images/icons.jpg')
  }
})
