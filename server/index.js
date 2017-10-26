'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const { Environment, FileSystemLoader } = require('nunjucks')
const NunjuckCustomWebLoader = require('./utils/nunjucks-custom-web-loader')
const Raven = require('raven')

const environment = require('./lib/environment')
const version = require('./version')
const controllers = require('./controllers')
const settings = require('./lib/settings')


// Initialize Raven
if (environment.production) {
  Raven.config(settings.SENTRY_DSN).install()
}

// Initiate express app and set Raven request handler
const app = express()
if (environment.production) {
  app.use(Raven.requestHandler())
}

app.set('x-powered-by', false)

app.use(bodyParser.json())


// Serve assests
// Assets are built through Webpack and will be loaded using webpack dev server
// when in development mode
app.use('/assets', express.static('/ratatoskr/build/assets'))


// Configure nunjucks template engine
const nunjucksOptions = {
  autoescape: true,
  noCache: environment.ifProduction(false, true),
}

const nunjucksEnvironment = new Environment(
  environment.ifProduction(
    new FileSystemLoader('/ratatoskr/build/templates', nunjucksOptions),
    new NunjuckCustomWebLoader(
      'templates',
      nunjucksOptions
    )
  )
)

// Set express app on the Nunjucks environment
nunjucksEnvironment.express(app)

// Set global template variables
nunjucksEnvironment
  .addGlobal('GA_CODE', settings.GA_CODE)
  .addGlobal('GTM_CODE', settings.GTM_CODE)
  .addGlobal('IS_PRODUCTION', environment.ifProduction(true, false))
  .addGlobal('IS_DEVELOPMENT', environment.ifDevelopment(true, false))

version.promise.then((tag) => {
  nunjucksEnvironment.addGlobal('VERSION', tag)
}).catch(() => {})

// Set the base router
app.use(process.env.VIRTUAL_PATH, controllers)

// Add Raven error handler
if (environment.production) {
  app.use(Raven.errorHandler())
}

// Fallthrough error handler
app.use((err, req, res, next) => {
  res.statusCode = 500
  if (environment.production) {
    res.end(res.sentry)
  } else {
    next(err)
  }
})

// Start the express app
if (!module.parent) {
  const port = process.env.VIRTUAL_PORT || 8080

  app.listen(port)
  console.log(`Server listening on port ${port}`) // eslint-disable-line
}


module.exports = app
module.exports.nunjucks = nunjucksEnvironment
