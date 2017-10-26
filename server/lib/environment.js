'use strict'

const environment = {
  production: process.env.NODE_ENV === 'production',
  development: process.env.NODE_ENV === 'development',
  test: process.env.NODE_ENV === 'test',
}


environment.ifProduction = (a, b) => (environment.production ? a : b)
environment.ifDevelopment = (a, b) => (environment.development ? a : b)
environment.ifTest = (a, b) => (environment.test ? a : b)


module.exports = environment
