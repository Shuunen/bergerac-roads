import { remoteApi, remoteDomainsUrl } from './common'
import fs from 'fs'
const output = './data/sample-domains.json'
const limit = 5

function getRemoteDomainsSample() {
  console.log('getting remote domains samples from api')
  console.log('using url :', remoteDomainsUrl)
  remoteApi.get(remoteDomainsUrl)
    .then(response => {
      if (response.data) {
        const remoteDomains = response.data.value
        console.log('found', remoteDomains.length, 'domains, but limit samples to', limit)
        remoteDomains.splice(limit)
        fs.writeFileSync(output, JSON.stringify(remoteDomains, null, 2), 'utf-8')
      } else {
        console.error('failed at getting remote domains')
      }
    })
    .then(() => console.log('updated', output, 'successfully :)'))
    .catch(error => console.error(error))
}

getRemoteDomainsSample()
