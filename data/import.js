const axios = require('axios')
const localApi = axios.create({
  baseURL: 'http://localhost:3003',
  timeout: 1000,
})
const isEqual = require('fast-deep-equal')
const fs = require('fs')
const postmanFile = fs.readFileSync('data/data.postman_config', 'utf-8')
const variables = readVariablesFromFile(postmanFile)
let remoteDomainsUrl = `http://${variables.syndic_url_opt}`
remoteDomainsUrl += `/${variables.syndic_name}`
remoteDomainsUrl += `/${variables.syndic_key}`
remoteDomainsUrl += `/Objects?$format=json`
let stopProcessing = false
let domainCreated = 0
let domainUpdated = 0
let domainSkipped = 0

function readVariablesFromFile(fileContent) {
  console.log('reading variables')
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
  // console.log('converting remote data to local')
  const local = {
    id: remote.SyndicObjectID,
    title: remote.SyndicObjectName,
    latitude: remote.GmapLatitude,
    longitude: remote.GmapLongitude,
    photos: [],
    active: true,
  }
  if (remote.PHOTO) {
    local.photos = remote.PHOTO.split('#')
  } else {
    console.warn(local.id, ': no photos found on remote data')
  }
  return local
}

function getLocalDomain(id) {
  console.log(id, ': getting local domain')
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
      console.log(newData.id, ': no updates \n')
    }
  })
}

async function updateLocalDomains(remoteDomains) {
  console.log('checking ' + remoteDomains.length + ' remote domains')
  for (let i = 0; i < remoteDomains.length; i++) {
    await updateLocalDomain(remoteDomains[i])
  }
}

function showSummary() {
  console.log('domain(s) created :', domainCreated)
  console.log('domain(s) updated :', domainUpdated)
  console.log('domain(s) skipped :', domainSkipped)
}

function getRemoteDomains() {
  console.log('getting remote domains from api')
  console.log('using url :', remoteDomainsUrl)
  axios
    .get(remoteDomainsUrl)
    .then(response => {
      if (response.data) {
        const remoteDomains = response.data.value
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
