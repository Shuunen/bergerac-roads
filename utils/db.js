import { cloneDeep } from 'lodash'

const db = require('~/data/db.json')

export const getVineyards = () => Promise.resolve(cloneDeep(db.vineyards))

export const getDomains = () => Promise.resolve(cloneDeep(db.domains))

export const getDomainsByTags = tags => {
  let domains = []
  for (let domain of db.domains) {
    if (domain.hasOwnProperty('tags') && tags.every(tag => domain.tags.includes(tag))) {
      domains.push(domain)
    }
  }
  return Promise.resolve(cloneDeep(domains))
}

export const getDomain = id => {
  let domain = db.domains.filter(domain => domain.id === id)
  domain = domain.length === 1 ? domain[0] : null
  return Promise.resolve(cloneDeep(domain))
}

export const getTags = () => Promise.resolve(cloneDeep(db.tags))
