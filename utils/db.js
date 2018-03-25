const db = require('~/db.json')

export const getDomains = () => Promise.resolve(db.domains)

export const getDomain = id => {
  let domain = db.domains.filter(domain => domain.id === parseInt(id, 10))
  domain = domain.length === 1 ? domain[0] : null
  return Promise.resolve(domain)
}

export const getTags = () => Promise.resolve(db.tags)
