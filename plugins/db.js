import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'

const db = require('~/data/db.json')

Vue.prototype.$db = {
  getVineyards: () => Promise.resolve(cloneDeep(db.vineyards)),
  getPrebuilts: () => Promise.resolve(cloneDeep(db.prebuilts)),
  getDomains: () => Promise.resolve(cloneDeep(db.domains)),
  getDomain: (id) => {
    let domain = db.domains.filter(domain => domain.id === id)
    domain = domain.length === 1 ? domain[0] : null
    return Promise.resolve(cloneDeep(domain))
  },
  getDomainsByTags: (tags) => {
    let domains = []
    for (let domain of db.domains) {
      if (domain.hasOwnProperty('tags') && tags.every(tag => domain.tags.includes(tag))) {
        domains.push(domain)
      }
    }
    return Promise.resolve(cloneDeep(domains))
  },
  getTags: () => Promise.resolve(cloneDeep(db.tags))
}
