import Vue from 'vue'
import getSlug from 'speakingurl'

export const eventBus = new Vue()

function getDomainUrl (domain) {
  return 'domaine/' + domain.id + '-' + getSlug(domain.title)
}

eventBus.$on('goto-domain', (domain) => {
  const url = getDomainUrl(domain)
  window.$nuxt.$router.push(url)
})
