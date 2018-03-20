

const db = require('static/db.json')

export const getDomains = () => Promise.resolve(db.domains)

export const getTags = () => Promise.resolve(db.tags)

