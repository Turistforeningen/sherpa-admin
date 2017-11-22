const fetchOptions = {
  GET: {
    credentials: 'same-origin',
  },
  POST: {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
  },
}


const checkStatus = (res) => {
  const headerOpts = {
    apiVersion: res.headers.get('API-VERSION'),
    appVersion: res.headers.get('APP-VERSION'),
  }
  if (res.status >= 200 && res.status < 300) {
    return Promise.resolve({headerOpts, res})
  }

  return res.json()
    .then((json) => {
      const error = new Error(json.error || 'unknown error')
      error.res = res
      return Promise.reject(error)
    })
}


export default ({url, ...opts}) => {
  const method = opts.method || 'GET'
  const defaultOptions = fetchOptions[opts.method]

  // Set fetch options
  const options = {
    ...defaultOptions,
    ...opts,
    headers: {
      ...defaultOptions.headers,
      ...(opts.headers || {}),
    },
  }

  // Run fetch query
  return fetch(url, options)
    .then(checkStatus)
    .then(({res, headerOpts}) => {
      if (!res.ok) {
        return Promise.reject(res.text().then((msg) => new Error(msg)))
      }

      const promise = new Promise((resolve, reject) => {
        res.json()
          .then((json) => {
            resolve({...json, HEADER_OPTS: headerOpts})
          })
          .catch((err) => {
            reject(new Error(err))
          })
      })

      return promise
    })
}
