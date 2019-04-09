const { localApi, remoteApi, remoteDomainsUrl, remoteDomainsUKTraductionsUrl } = require('./common')
const find = require('lodash/find')
const isEqual = require('fast-deep-equal')
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('data/db.json')
const middlewares = jsonServer.defaults()
const justProcessOne = false
const justLogChanges = true
let stopProcessing = false
let objectCreated = 0
let objectUpdated = 0
let objectSkipped = 0
const urlsByType = {
  domains: remoteDomainsUrl,
  traductions: remoteDomainsUKTraductionsUrl,
}
const remoteTagsToLocal = {
  ACCESHANDI: 'acces-handicape',
  HEBERGEMENT: 'hebergement',
  CAMPING: 'camping',
  RESAURATION: 'restauration',
  ENV_HUMAIN: 'env-humain',
}
const remoteTags = Object.keys(remoteTagsToLocal)
const remoteVineyardsToLocal = {
  Bergerac: 'bergerac',
  Duras: 'duras',
  Monbazillac: 'monbazillac',
  Montravel: 'montravel',
  'Pécharmant': 'pecharmant',
  Rosette: 'rosette',
  Saussignac: 'saussignac',
}
const remoteVineyards = Object.keys(remoteVineyardsToLocal)
let traductions = []

/**
 * Convert ugly string with variable separators into nice arrays
 * @param {string} tag remote input tag string
 * @param {string} separator the separator (often # or |)
 */
function getArrayFromRemoteTag(tag, separator) {
  if (!tag) {
    return []
  }
  return tag.split(separator).filter(data => data.length)
}

async function getRemoteDomainTraduction(id) {
  if (traductions.length === 0) {
    console.log('getting remote domain traductions once...')
    traductions = await remoteApi.get(urlsByType.traductions).then(r => r.data.value)
  }
  if (justProcessOne) {
    console.log('get remote domain traduction for id : ' + id)
  }
  const traduction = find(traductions, { SyndicObjectID: id }) || {}
  // console.log('traduction.DESCRIPTIF', traduction.DESCRIPTIF)
  return traduction
}

/**
 * Convert large remote data into data that we will store in our db
 * Look at sample-domains.json to see remote data structure
 * @param {Domain} remote the domain data from remote API
 */
async function remoteDomainToLocal(remote) {
  const remoteTrad = await getRemoteDomainTraduction(remote.SyndicObjectID)
  if (justProcessOne) {
    console.log('converting remote data to local')
    // console.log('remoteTrad found :', remoteTrad)
  }
  const local = {
    active: true,
    activities: remote.ANIMATIONS,
    description: remote.DESCRIPTIF,
    descriptionEn: remoteTrad.DESCRIPTIF || null,
    id: remote.SyndicObjectID,
    labels: getLabelsFromRemoteDomain(remote),
    langs: getArrayFromRemoteTag(remote.LANGPARLE, '#'),
    latitude: remote.GmapLatitude,
    longitude: remote.GmapLongitude,
    mail: remote.MAIL,
    number: remote.NUMEROCARTE,
    openHours: getArrayFromRemoteTag(remote.OUVERTURE, '#'),
    phones: getArrayFromRemoteTag(remote.TELCOMPLET, '|'),
    photos: getArrayFromRemoteTag(remote.PHOTO, '#'),
    plus: remote.PETITPLUS,
    services: getArrayFromRemoteTag(remote.PRESTATIONS, '#'),
    socialFacebook: remote.FACEBOOK,
    statuses: getArrayFromRemoteTag(remote.STATUTEXPLOIT, '#'),
    tags: getTagsFromRemoteDomain(remote),
    title: remote.SyndicObjectName,
    tourContitions: getArrayFromRemoteTag(remote.VISITECONDITIONS, '#'),
    tourMinutes: remote.VISITEDUREE,
    town: remote.COMMUNE,
    adress: remote.AD2,
    vineyards: getVineyardsFromRemoteDomain(remote),
    websites: getArrayFromRemoteTag(remote.URLCOMPLET, '|'),
  }
  return local
}

function getVineyardsFromRemoteDomain(domain) {
  let vineyards = []
  remoteVineyards.forEach(vineyard => {
    if (domain.AOC && domain.AOC.includes(vineyard)) {
      if (justProcessOne) {
        console.log('vineyard "' + vineyard + '" found')
      }
      vineyards.push(remoteVineyardsToLocal[vineyard])
    }
  })
  if (justProcessOne) {
    console.log('found vineyards', vineyards)
  }
  return vineyards
}

function getTagsFromRemoteDomain(domain) {
  if (justProcessOne) {
    console.log('get tags from remote', domain)
  }
  let tags = []
  let prestations = domain['PRESTATIONS']

  if (prestations) {
    prestations = prestations.split('#')
    prestations.forEach(presta => {
      if (presta === 'Hébergement sur place') {
        domain['HEBERGEMENT'] = 'oui'
      }
      if (presta === 'Aire de camping-car sur place') {
        domain['CAMPING'] = 'oui'
      }
      if (presta === 'Restauration sur place') {
        domain['RESAURATION'] = 'oui'
      }

    })
  }

  let agribio = domain['AGRIBIO']
  if (agribio === 'non') {
    let labelsCharte = domain['LABELSCHARTE']
    if (labelsCharte) {
      labelsCharte = labelsCharte.split('#')
      labelsCharte.forEach(labelCharte => {
        if (labelCharte === 'Haute valeur environnementale' || labelCharte === 'Terravitis') {
          domain['ENV_HUMAIN'] = 'oui'
        }
      })
    }
  } else {
    domain['ENV_HUMAIN'] = 'oui'
  }
  remoteTags.forEach(tag => {
    if (domain[tag] && domain[tag] === 'oui') {
      if (justProcessOne) {
        console.log('tag "' + tag + '" found')
      }
      tags.push(remoteTagsToLocal[tag])
    }
  })
  tags = tags.concat(getWineTagsFromRemoteDomain(domain))
  if (justProcessOne) {
    console.log('found tags', tags)
  }
  return tags
}

function getWineTagsFromRemoteDomain(domain) {
  let tags = []
  const str = domain.AOCCOMPLEMENTAIRE
  if (!str) {
    return tags
  }
  // in  :  "Bergerac (rouge)#Bergerac (rosé)#Bergerac (blanc sec)#Pécharmant (rouge)"
  // out : ["Bergerac (rouge)", "Bergerac (rosé)", "Bergerac (blanc sec)", "Pécharmant (rouge)"]
  // so we should find 4 wines types here
  const arr = str.split('#')
  // and to be sure we search via regex known wines types
  // in  :  "Bergerac (rouge)#Bergerac (rosé)#Bergerac (blanc sec)#Pécharmant (rouge)"
  // out : ["rouge", "rosé", "blanc sec", "rouge"]
  tags = str.match(/(blanc sec|moelleux|liquoreux|rosé|rouge)/gi)
  // and we should exactly find the same amount
  if (arr.length !== tags.length) {
    console.error('ERROR : found', tags.length, 'wines instead of', arr.length)
    console.error('ERROR : str was : "' + str + '"')
    stopProcessing = true
    return tags
  }
  // because there is duplicates sometimes, reducing to unique values
  // in  : ['rouge','rosé','blanc sec', 'rouge']
  // out : ['rouge','rosé','blanc sec']
  tags = tags.filter((v, i, a) => a.indexOf(v) === i)
  // because values contains accents, space and non-pretty usable dev names
  // let's clean these up
  // in  : ['rouge',    'rosé',    'blanc sec']
  // out : ['vin-rouge','vin-rose','vin-blanc']
  tags = tags.map(name => getWineTagFromName(name))
  return tags
}

function getLabelsFromRemoteDomain(domain) {
  let labels = domain.LABELS
  if (!labels || !labels.length) {
    return []
  }
  labels = labels.split('#')
  labels = labels.map(label => {
    if (label === 'Vignobles et découvertes') {
      return 'vignobles-et-decouvertes'
    } else if (label === 'Bienvenue à la Ferme') {
      return 'bienvenue-a-la-ferme'
    } else if (label === 'Saveurs du Périgord') {
      return 'saveurs-du-perigord'
    } else {
      console.error('ERROR : label not handled yet : "' + label + '"')
      return null
    }
  })
  labels = labels.filter(label => label !== null)
  return labels
}

function getWineTagFromName(name) {
  if (name === 'blanc sec') {
    return 'vin-blanc'
  } else if (name === 'rosé') {
    return 'vin-rose'
  } else {
    // ne need to have more case because other name are clean :
    // vin-moelleux
    // vin-liquoreux
    // vin-rouge
    return 'vin-' + name
  }
}

function getLocalDomain(id, type) {
  // console.log(id, ': getting local domain')
  return localApi
    .get('/' + type + '/' + id)
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

function addLocalDomain(data, type) {
  console.log('adding local domain with id', data.id)
  return localApi
    .post('/' + type, data)
    .then(() => {
      objectCreated++
      console.log(data.id, ': freshly added !')
    })
    .catch(error => {
      console.error(error)
      stopProcessing = true
    })
}

function patchLocalDomain(data, type) {
  return localApi
    .put('/' + type + '/' + data.id, data)
    .then(() => {
      objectUpdated++
      console.log(data.id, ': updated')
    })
    .catch(error => {
      console.error(error)
      stopProcessing = true
    })
}

async function updateLocalObject(remoteObject, type = 'domains') {
  if (stopProcessing) {
    throw Error('stop processing requested')
  }

  // console.log('updateLocalObject type = ', type)
  let newData = ''

  if (type === 'domains') {
    newData = await remoteDomainToLocal(remoteObject)
  } else {
    throw Error('update local object does not handle type "' + type + '"')
  }

  if (justProcessOne) {
    console.log('data should be', newData)
  }

  return getLocalDomain(newData.id, type).then(response => {
    if (response === 'does-not-exists') {
      return addLocalDomain(newData, type)
    }
    const localData = response
    if (!isEqual(localData, newData)) {
      // console.log(localData, 'IS NOT', newData)
      newData.updated = Date.now()
      return patchLocalDomain(newData, type)
    } else {
      objectSkipped++
      if (!justLogChanges || justProcessOne) {
        console.log(newData.id, ': no updates \n')
      }
    }
  })
}

/**
 * Handy helper to pause sequentials tasks
 * @param {number} time time in milliseconds
 */
async function pause(time) {
  return new Promise((resolve) => setTimeout(() => resolve('success, pause ended'), time))
}

async function updateLocalObjects(remoteObjects, type) {
  console.log('checking ' + remoteObjects.length + ' remote ' + type)
  for (let i = 0; i < remoteObjects.length; i++) {
    await pause(50)
    await updateLocalObject(remoteObjects[i], type)
  }
}

function showSummary(type) {
  const box = 30
  console.log('╔' + '═'.repeat(box) + '╗')
  console.log('║ import summary               ║')
  console.log('║ file : db.json               ║')
  console.log('║ ---                          ║')
  console.log('║ ' + type + ' created :', objectCreated)
  console.log('║ ' + type + ' updated :', objectUpdated)
  console.log('║ ' + type + ' skipped :', objectSkipped)
  console.log('╚' + '═'.repeat(box) + '═')
}

async function getRemoteObjects(type) {
  objectCreated = 0
  objectUpdated = 0
  objectSkipped = 0
  console.log('getting remote ' + type + ' from api')

  let apiurl = urlsByType[type]
  console.log('using url :', apiurl)

  return remoteApi.get(apiurl)
    .then(response => {
      if (response.data) {
        const remoteObjects = response.data.value
        if (justProcessOne) {
          return updateLocalObjects(remoteObjects.splice(0, 1), type)
        }
        return updateLocalObjects(remoteObjects, type)
      } else {
        throw Error('failed at getting remote ' + type)
      }
    })
    .then(() => showSummary(type))
    .catch(error => {
      console.error(error)
      stopProcessing = true
    })
}

async function start() {
  console.log('Json Server is running')
  await getRemoteObjects('domains')
  await pause(1000)
  process.exit(0)
}

// start Json Server
server.use(middlewares)
server.use(router)
server.listen(3003, start)

// For testing purpose :
// const sampleDomains = require('./sample-domains.json').value
// updateLocalObjects(sampleDomains)
