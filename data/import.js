import { localApi, remoteApi, remoteDomainsUrl } from './common'
const isEqual = require('fast-deep-equal')
const justProcessOne = false
const justLogChanges = true
let stopProcessing = false
let domainCreated = 0
let domainUpdated = 0
let domainSkipped = 0
const remoteTagsToLocal = {
  ACCESHANDI: 'acces-handicape',
  AGRIBIO: 'agriculture-bio',
  AGRIBIODYN : 'agriculture-biodynamique',
  AGRIRAISONNE: 'agriculture-raisonnee',
  ANIMAUX: 'accepte-animaux',
  VENTEPROPRIETE: 'vente-propriete',
}
const remoteTags = Object.keys(remoteTagsToLocal)

/**
 * Convert large remote data into data that we will store in our db
 * Look at sample-domains.json to see remote data structure
 * @param {Domain} remote the domain data from remote API
 */
function remoteDomainToLocal(remote) {
  // console.log('converting remote data to local')
  const local = {
    id: remote.SyndicObjectID,
    title: remote.SyndicObjectName,
    latitude: remote.GmapLatitude,
    longitude: remote.GmapLongitude,
    photos: remote.PHOTO ? remote.PHOTO.split('#') : [],
    tags: getTagsFromRemoteDomain(remote),
    active: true,
  }
  return local
}

function getTagsFromRemoteDomain(domain) {
  const tags = []
  remoteTags.forEach(tag => {
    if (domain[tag] && domain[tag] === 'oui') {
      // console.log('tag "'+tag+'" found')
      tags.push(remoteTagsToLocal[tag])
    }
  })
  // console.log('found tags', tags)
  return tags
}

function getLocalDomain(id) {
  // console.log(id, ': getting local domain')
  return localApi
    .get('/domains/' + id)
    .then(response => {
      const localDomain = response.data
      delete localDomain.updated // so we dont to compare or check this
      // console.log('domain with id', id, 'has been found')
      return localDomain
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        return 'does-not-exists'
      } else {
        console.error(error)
        stopProcessing = true
      }
    })
}

function addLocalDomain(data) {
  console.log('adding local domain with id', data.id)
  return localApi
    .post('/domains', data)
    .then(() => {
      domainCreated++
      console.log(data.id, ': freshly added !')
    })
    .catch(error => {
      console.error(error)
      stopProcessing = true
    })
}

function patchLocalDomain(data) {
  return localApi
    .patch('/domains/' + data.id, data)
    .then(() => {
      domainUpdated++
      console.log(data.id, ': updated !\n')
    })
    .catch(error => {
      console.error(error)
      stopProcessing = true
    })
}

function updateLocalDomain(remoteDomain) {
  if (stopProcessing) {
    return Promise.error('stop processing requested')
  }
  const newData = remoteDomainToLocal(remoteDomain)
  return getLocalDomain(newData.id).then(response => {
    if (response === 'does-not-exists') {
      return addLocalDomain(newData)
    }
    const localData = response
    if (!isEqual(localData, newData)) {
      newData.updated = Date.now()
      return patchLocalDomain(newData)
    } else {
      domainSkipped++
      if (!justLogChanges) {
        console.log(newData.id, ': no updates \n')
      }
    }
  })
}

async function updateLocalDomains(remoteDomains) {
  console.log('checking ' + remoteDomains.length + ' remote domains')
  for (let i = 0; i < remoteDomains.length; i++) {
    await updateLocalDomain(remoteDomains[i])
  }
}

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
if (!String.prototype.padEnd) {
  String.prototype.padEnd = function padEnd(targetLength,padString) {
    targetLength = targetLength >> 0 // floor if number or convert non-number to 0;
    padString = String((typeof padString !== 'undefined' ? padString : ' '))
    if (this.length > targetLength) {
      return String(this)
    } else {
      targetLength = targetLength - this.length
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length) // append to original to ensure we are longer than needed
      }
      return String(this) + padString.slice(0,targetLength)
    }
  }
}

function showSummary() {
  const box = 30
  console.log('╔' + '═'.repeat(box) + '╗')
  console.log('║ import summary               ║')
  console.log('║ file : db.json               ║')
  console.log('║ ---                          ║')
  console.log('║ domain(s) created :', String(domainCreated).padEnd(box - 22), '║')
  console.log('║ domain(s) updated :', String(domainUpdated).padEnd(box - 22), '║')
  console.log('║ domain(s) skipped :', String(domainSkipped).padEnd(box - 22), '║')
  console.log('╚' + '═'.repeat(box) + '╝')
}

function getRemoteDomains() {
  console.log('getting remote domains from api')
  console.log('using url :', remoteDomainsUrl)
  remoteApi.get(remoteDomainsUrl)
    .then(response => {
      if (response.data) {
        const remoteDomains = response.data.value
        if (justProcessOne) {
          return updateLocalDomains(remoteDomains.splice(0, 1))
        }
        return updateLocalDomains(remoteDomains)
      } else {
        console.error('failed at getting remote domains')
      }
    })
    .then(() => showSummary())
    .catch(error => {
      console.error(error)
      stopProcessing = true
    })
}

getRemoteDomains()

// For testing purpose :
// const sampleDomains = require('./sample-domains.json').value
// updateLocalDomains(sampleDomains)
