const axios = require('axios')
const localApi = axios.create({
  baseURL: 'http://localhost:3003',
  timeout: 1000,
})
const isEqual = require('fast-deep-equal')
const domains = require('./sample-domains.json').value

let stopProcessing = false

console.log('will check ' + domains.length + ' domains')
domains.forEach(domain => {
  if (stopProcessing) {
    return
  }
  const id = domain.SyndicObjectID
  const newData = {
    id,
    title: domain.SyndicObjectName,
    active: true,
  }
  localApi
    .get('/domains/' + id)
    .then(response => {
      const localData = response.data
      delete localData.updated // so we dont compare this
      // console.log('domain with id', id, 'has been found')
      if (!isEqual(localData, newData)) {
        newData.updated = Date.now()
        return localApi
          .patch('/domains/' + id, newData)
          .then(() => console.log(id, ': updated !'))
      } else {
        console.log(id, ': no updates')
      }
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        localApi
          .post('/domains', newData)
          .then(() => {
            console.log(id, ': created !')
          })
          .catch(error => {
            console.error(error)
            stopProcessing = true
          })
      } else {
        console.error(error)
        stopProcessing = true
      }
    })
})
