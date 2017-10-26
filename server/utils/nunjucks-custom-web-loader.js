'use strict'

const { Loader } = require('nunjucks')

const loadFromWebpackDevServer = require('./load-from-webpack-dev-server')


const NunjuckCustomWebLoader = Loader.extend({
  async: true,

  init: (baseURL) => {
    this.baseURL = baseURL || '.'
  },

  getSource: (name, cb) => {
    let result
    try {
      loadFromWebpackDevServer(`${this.baseURL}/${name}`)
        .then((src) => {
          result = {
            src,
            path: name,
            noCache: !this.useCache,
          }
          if (cb) {
            cb(null, result)
          }
        })
    } catch (e) {
      console.log('UNABLE TO LOAD TEMPLATE FROM WEBPACK')
      console.log(e)
    }
  },
})


module.exports = NunjuckCustomWebLoader
