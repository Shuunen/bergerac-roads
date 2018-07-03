const axios = require('axios')
const localApi = axios.create({
  baseURL: 'http://localhost:3003',
  timeout: 1000,
})
const fs = require('fs')
const postmanFile = fs.readFileSync('data/data.postman_config', 'utf-8')
const variables = readVariablesFromFile(postmanFile)
let remoteDomainsUrl = `/${variables.syndic_name}`
remoteDomainsUrl += `/${variables.syndic_key}`
remoteDomainsUrl += '/Objects?$format=json'
const remoteApi = axios.create({
  baseURL: `http://${variables.syndic_url_opt}`,
  timeout: 1000,
})

function readVariablesFromFile(fileContent) {
  // console.log('reading variables')
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

export { localApi, remoteApi, remoteDomainsUrl }
