'use strict'

const librato = require('librato-node')

const environment = require('./environment')
const settings = require('./settings')


const LIBRATO_PREFIX = process.env.LIBRATO_PREFIX || 'ratatoskr'
const LIBRATO_SOURCE = process.env.LIBRATO_SOURCE || 'ratatoskr'


librato.configure({
  email: settings.LIBRATO_EMAIL,
  token: settings.LIBRATO_TOKEN,
  simulate: environment.ifDevelopment(true, false),
  period: 60000,
})

librato.start()

// Stop librato process on SIGINT
process.once('SIGINT', () => {
  librato.stop()
})


// Errorhandler
librato.on('error', (err) => {
  console.error(`LIBRATO ERROR: ${err}`) // eslint-disable-line
})


const createName = (req, key) => {
  // Construct name from request path, method and key

  // TODO(Roar): This replaces ending userid on login paths with the string
  // "ID". It's not very foolproof, and any new routes that are added later
  // will need to accomedate this (or change it).

  if (req) {
    const pathName = req.url
      .toLowerCase()
      .substr(1)
      .replace(/[:.]/g, '')
      .replace(/\//g, '.')
      .replace(/login\.\d+$/, 'login.ID')
    const method = req.method.toLowerCase()

    return `${LIBRATO_PREFIX}.api.${method}.${pathName}.${key}`
  }

  return `${LIBRATO_PREFIX}.api.${key}`
}


const increment = (req, key) => {
  const name = createName(req, key)
  librato.increment(name, 1, {source: LIBRATO_SOURCE})
}


const measure = (req, key, value) => {
  const name = createName(req, key)
  librato.measure(name, value, {source: LIBRATO_SOURCE})
}


module.exports = {
  increment,
  measure,
}
