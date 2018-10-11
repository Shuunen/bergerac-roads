const axios = require('axios')
const localApi = axios.create({
  baseURL: 'http://localhost:3003',
  timeout: 1000,
})
/*
const fs = require('fs')
const postmanFile = fs.readFileSync('data/data.postman_config', 'utf-8')
const variables = readVariablesFromFile(postmanFile) */

let syndic_key = '64fb655d-796e-495b-96b0-e5bb01854cdb'
let syndic_key_uk = '8118b915-4d0d-4f30-a64e-42aac576c0d0'
let syndic_name = 'cdt24'
let syndic_url_opt = 'wcf.tourinsoft.com/Syndication/3.0'


let remoteDomainsUrl = 'http://' + syndic_url_opt
    + '/' + syndic_name
    + '/' + syndic_key
    + '/Objects?$format=json'

let remoteDomainsUKTraductionsUrl = 'http://' + syndic_url_opt
    + '/' + syndic_name
    + '/' + syndic_key_uk
    + '/Objects?$format=json'

let baseUrl = 'http://wcf.tourinsoft.com/Syndication/3.0'
const remoteApi = axios.create({
  baseUrl,
  timeout: 1000,
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

export { localApi, remoteApi, remoteDomainsUrl, remoteDomainsUKTraductionsUrl }
