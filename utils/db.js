
const baseUrl = process.env.api
const storageKey = 'bergeracRoads.'

export const getLocalOrFetch = (ressource) => {
  try {
    return Promise.resolve(JSON.parse(localStorage[storageKey + ressource]))
  } catch (error) {
    const data = require('static/db.json')
    console.log('getLocalOrFetch : localStorage', localStorage)
    return Promise.resolve(data[ressource])
  }
}

