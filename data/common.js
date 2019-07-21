const axios = require('axios')
const localApi = axios.create({
  baseURL: 'http://localhost:3003',
  timeout: 1000,
})
/*
const fs = require('fs')
const postmanFile = fs.readFileSync('data/data.postman_config', 'utf-8')
const variables = readVariablesFromFile(postmanFile) */

const syndicKey = '64fb655d-796e-495b-96b0-e5bb01854cdb'
const syndicKeyUk = '8118b915-4d0d-4f30-a64e-42aac576c0d0'
const syndicName = 'cdt24'
const syndicUrlOpt = 'wcf.tourinsoft.com/Syndication/3.0'

const remoteDomainsUrl = 'http://' + syndicUrlOpt +
  '/' + syndicName +
  '/' + syndicKey +
  '/Objects?$format=json'

const remoteDomainsUKTraductionsUrl = 'http://' + syndicUrlOpt +
  '/' + syndicName +
  '/' + syndicKeyUk +
  '/Objects?$format=json'

const baseUrl = 'http://wcf.tourinsoft.com/Syndication/3.0'
const remoteApi = axios.create({
  baseUrl,
  timeout: 10000,
})

/*
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
*/

module.exports = { localApi, remoteApi, remoteDomainsUrl, remoteDomainsUKTraductionsUrl }
