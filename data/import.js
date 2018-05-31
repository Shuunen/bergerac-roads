const axios = require('axios')
const localApi = axios.create({
  baseURL: 'http://localhost:3003',
  timeout: 1000,
})
const isEqual = require('fast-deep-equal')
const fs = require('fs')
const postmanFile = fs.readFileSync('data/data.postman_config', 'utf-8')
const variables = readVariablesFromFile(postmanFile)
const remoteDomainsUrl = `http://${variables.syndic_url_opt}
/${variables.syndic_name}/${variables.syndic_key}/Objects?$format=json`
let stopProcessing = false

function readVariablesFromFile(fileContent) {
  const variables = {}
  fileContent.split('\r\n').map(line => {
    // iterate on each line
    if (!line.includes(':')) {
      return null
    }
    const data = line.split(':')
    variables[data[0]] = data[1]
  })
  // console.log(variables)
  return variables
}

/**
 * Convert large remote data into data that we will store in our db
 * Look at sample-domains.json to see remote data structure
 * @param {Domain} remote the domain data from remote API
 */
function remoteDomainToLocal(remote) {
  return {
    id: remote.SyndicObjectID,
    title: remote.SyndicObjectName,
    latitude: remote.GmapLatitude,
    longitude: remote.GmapLongitude,
    active: true,
  }
}

function getLocalDomain(id) {
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
  return localApi
    .post('/domains', data)
    .then(() => {
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
    .then(() => console.log(data.id, ': updated !'))
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
      console.log(newData.id, ': no updates')
    }
  })
}

async function updateLocalDomains(remoteDomains) {
  console.log('checking ' + remoteDomains.length + ' remote domains')
  for (let i = 0; i < remoteDomains.length; i++) {
    await updateLocalDomain(remoteDomains[i])
  }
}

function getRemoteDomains() {
  axios.get(remoteDomainsUrl).then(response => {
    if (response.data) {
      const remoteDomains = response.data.value
      updateLocalDomains(remoteDomains)
    } else {
      console.error('failed at getting remote domains')
    }
  })
}

getRemoteDomains()

// For testing purpose :
// const sampleDomains = require('./sample-domains.json').value
// updateLocalDomains(sampleDomains)
