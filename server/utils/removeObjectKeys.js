'use strict'


const removeEntry = (data, keys) => {
  keys.forEach((key, idx) => {
    if (data[key] !== 'undefined') {
      if (idx !== keys.length - 1) {
        const nextData = Object.assign({}, data[key])
        data[key] = removeEntry(nextData, keys.slice(1))
      } else {
        delete data[key]
      }
    }
  })
  return data
}


module.exports = (data, options) => {
  let res = Object.assign({}, data)

  options.forEach((keys) => {
    res = removeEntry(res, keys)
  })

  return res
}
