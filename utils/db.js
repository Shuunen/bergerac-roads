const db = require('~/data/db.json')

export const getVineyards = () => Promise.resolve(db.vineyards)

export const getDomains = () => Promise.resolve(db.domains)

export const getDomainsByTags = tags => {
  let domains = []
  for (let domain of db.domains) {
    if (domain.hasOwnProperty('tags') && tags.every(tag => domain.tags.includes(tag))) {
      domains.push(domain)
    }
  }
  return Promise.resolve(domains)
}

export const getDomain = id => {
  let domain = db.domains.filter(domain => domain.id === id)
  domain = domain.length === 1 ? domain[0] : null
  return Promise.resolve(domain)
}

export const getTags = () => Promise.resolve(db.tags)
