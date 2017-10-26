'use strict'

const http = require('http')


module.exports = (path) => {
  const promise = new Promise((resolve, reject) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    http.get(`http://admin-client-assets.dnt.local/${path}`, (res) => {
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })
      res.on('end', () => {
        resolve(rawData)
      })
    }).on('error', (e) => {
      throw e
    })
  })

  return promise
}
