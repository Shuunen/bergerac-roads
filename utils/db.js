const db = require('~/data/db.json')

export const getVineyards = () => Promise.resolve(db.vineyards)

export const getDomains = () => Promise.resolve(db.domains)

export const getDomain = id => {
  let domain = db.domains.filter(domain => domain.id === id)
  domain = domain.length === 1 ? domain[0] : null
  return Promise.resolve(domain)
}

export const getTags = () => Promise.resolve(db.tags)
