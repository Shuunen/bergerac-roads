import { localApi, remoteApi, remoteDomainsUrl } from './common'
const isEqual = require('fast-deep-equal')
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('data/db.json')
const middlewares = jsonServer.defaults()
const justProcessOne = false
const justLogChanges = true
let stopProcessing = false
let domainCreated = 0
let domainUpdated = 0
let domainSkipped = 0
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

/**
 * Convert large remote data into data that we will store in our db
 * Look at sample-domains.json to see remote data structure
 * @param {Domain} remote the domain data from remote API
 */
function remoteDomainToLocal(remote) {
  // console.log('converting remote data to local')
  const local = {
    active: true,
    activities: remote.ANIMATIONS,
    description: remote.DESCRIPTIF,
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
      // console.log('vineyard "'+vineyard+'" found')
      vineyards.push(remoteVineyardsToLocal[vineyard])
    }
  })
  if (justProcessOne) {
    console.log('found vineyards', vineyards)
  }
  return vineyards
}

function getTagsFromRemoteDomain(domain) {
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
    labelsCharte = labelsCharte.split('#')
    labelsCharte.forEach(labelCharte => {
      if (labelCharte === 'Haute valeur environnementale' || labelCharte === 'Terravitis') {
        domain['ENV_HUMAIN'] = 'oui'
      }
    })
  } else {
    domain['ENV_HUMAIN'] = 'oui'
  }
  remoteTags.forEach(tag => {
    if (domain[tag] && domain[tag] === 'oui') {
      // console.log('tag "'+tag+'" found')
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
    .put('/domains/' + data.id, data)
    .then(() => {
      domainUpdated++
      console.log(data.id, ': updated')
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

async function pause(time) {
  return new Promise((resolve) => setTimeout(() => resolve('success, pause ended'), time))
}

async function updateLocalDomains(remoteDomains) {
  console.log('checking ' + remoteDomains.length + ' remote domains')
  for (let i = 0; i < remoteDomains.length; i++) {
    await pause(50)
    await updateLocalDomain(remoteDomains[i])
  }
}

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
if (!String.prototype.padEnd) {
  String.prototype.padEnd = function padEnd(targetLength, padString) {
    targetLength = targetLength >> 0 // floor if number or convert non-number to 0;
    padString = String((typeof padString !== 'undefined' ? padString : ' '))
    if (this.length > targetLength) {
      return String(this)
    } else {
      targetLength = targetLength - this.length
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length) // append to original to ensure we are longer than needed
      }
      return String(this) + padString.slice(0, targetLength)
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
    .then(() => {
      setTimeout(() => process.exit(0), 1000)
    })
}

// start Json Server
server.use(middlewares)
server.use(router)
server.listen(3003, () => {
  console.log('Json Server is running')
  getRemoteDomains()
})


// For testing purpose :
// const sampleDomains = require('./sample-domains.json').value
// updateLocalDomains(sampleDomains)
