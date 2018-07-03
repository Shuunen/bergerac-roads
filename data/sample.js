import { remoteApi, remoteDomainsUrl } from './common'
import fs from 'fs'
const isEqual = require('fast-deep-equal')
const output = './data/sample-domains.json'
const limit = 5
let domainUpdated = 0
let domainSkipped = 0
const localSamples = JSON.parse(fs.readFileSync(output, 'utf-8'))

function getRemoteDomainsSample() {
  console.log('getting remote domains samples from api')
  // console.log('using url :', remoteDomainsUrl)
  remoteApi.get(remoteDomainsUrl)
    .then(response => {
      if (response.data) {
        const remoteDomains = response.data.value
        // console.log('found', remoteDomains.length, 'domains, but limit samples to', limit)
        remoteDomains.splice(limit)
        return compareWithLocals(remoteDomains)
      } else {
        console.error('failed at getting remote domains')
      }
    })
    .then(() => showSummary())
    .catch(error => console.error(error))
}

function compareWithLocals(remoteSamples) {
  return new Promise((resolve, reject) => {
    localSamples.forEach((local, index) => {
      // console.log(index, local.SyndicObjectID)
      if (isEqual(local, remoteSamples[index])) {
        domainSkipped++
      } else {
        domainUpdated++
      }
    })
    if (domainUpdated > 0) {
      fs.writeFile(output, JSON.stringify(remoteSamples, null, 2), 'utf-8', (err) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          resolve('success, updated json file')
        }
      })
    } else {
      resolve('success, no changes')
    }
  })
}

function showSummary() {
  const box = 30
  // console.log('updated', limit, 'sample domains in', output, 'successfully :)')
  console.log('╔' + '═'.repeat(box) + '╗')
  console.log('║ sample summary               ║')
  console.log('║ file : sample-domains.json   ║')
  console.log('║ ---                          ║')
  console.log('║ domain(s) updated :', String(domainUpdated).padEnd(box - 22), '║')
  console.log('║ domain(s) skipped :', String(domainSkipped).padEnd(box - 22), '║')
  console.log('╚' + '═'.repeat(box) + '╝')
}

getRemoteDomainsSample()
