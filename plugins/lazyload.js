import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  // src of the image upon load fail
  error: '/icons/no-image.png',

  // from https://github.com/hilongjw/vue-lazyload#intersectionobserver
  // set observer to true
  observer: true,

  lazyComponent: true,

  // optional
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.1,
  },
})
