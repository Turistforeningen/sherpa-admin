'use strict'

const fs = require('fs')

const environment = require('./environment')


const variables = [
  {
    name: 'APP_SECRET',
  },
  {
    name: 'OAUTH_CLIENT_ID',
  },
  {
    name: 'OAUTH_CLIENT_SECRET',
  },
  {
    name: 'OAUTH_DOMAIN',
    default: 'https://www.dnt.no',
  },
  {
    name: 'SENTRY_DSN',
    env: ['production'],
  },
  {
    name: 'GA_CODE',
    env: ['production'],
  },
  {
    name: 'GTM_CODE',
    env: ['production'],
  },
  {
    name: 'LIBRATO_EMAIL',
    env: ['production'],
  },
  {
    name: 'LIBRATO_TOKEN',
    env: ['production'],
  },
]


function getFromJson(file) {
  try {
    return JSON.parse(
      fs.readFileSync(file, {encoding: 'utf-8'})
    )
  } catch (err) {
    throw new Error(`Could not read secrets file "${file}"`)
  }
}


let settings


// Set settings from secrets file
if (environment.development || environment.test) {
  settings = getFromJson(`${__dirname}/../../secrets-dev/dev.json`)
} else if (environment.production) {
  settings = getFromJson('/secrets/prod.json')
} else {
  throw new Error('Environment variable "NODE_ENV" is undefined or invalid')
}


// Verify that all variables are set from secrets, or use the default value
variables
  .filter((variable) => {
    if (variable.env) {
      return variable.env.includes(process.env.NODE_ENV)
    }
    return true
  })
  .forEach((variable) => {
    if (typeof settings[variable.name] === 'undefined') {
      if (typeof variable.default !== 'undefined') {
        settings[variable.name] = variable.default
      } else {
        throw new Error(`Environvent variable ${variable.name} is missing`)
      }
    }
  })


module.exports = settings
