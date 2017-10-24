'use strict';

const fetch = require('isomorphic-fetch');

const redis = require('../lib/redis');
const settings = require('../lib/settings');


const CREDENTIALS = Buffer.from(
  `${settings.OAUTH_CLIENT_ID}:${settings.OAUTH_CLIENT_SECRET}`
).toString('base64');


const errorResolve = (name) => (err) => {
  console.log(`****** ERROR :: ${name}`); // eslint-disable-line
  console.log(err); // eslint-disable-line
  return Promise.reject(err);
};


const tokenRequest = (body) => (
  fetch(`${settings.OAUTH_DOMAIN}/o/token/`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${CREDENTIALS}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
    .then((result) => (
      result.status >= 200 && result.status <= 299
        ? Promise.resolve(result)
        : Promise.reject(result)
    ))
);


const getClientTokensFromSherpa = () => (
  tokenRequest('grant_type=client_credentials')
    .then((result) => result.json())
    .then((tokens) => {
      const serialized = JSON.stringify(tokens);
      redis.hset('sherpa', 'client_credentials', serialized);
      return Promise.resolve(tokens);
    })
    .catch(errorResolve('getClientTokensFromSherpa'))
);


const getUserTokensFromSherpa = (email, password, userId, smsAuth) => {
  const smsAuthParam = smsAuth ? '&sms_auth=1' : '';
  const body =
    `grant_type=password&username=${encodeURIComponent(email)}` +
    `&password=${encodeURIComponent(password)}` +
    `&userid=${userId}${smsAuthParam}`;

  return tokenRequest(body)
    .then((result) => result.json())
    .catch((err) => Promise.reject(new Error(err.status)));
};


const getUserTokensByRefreshTokenFromSherpa = (refreshToken) => {
  const body = `grant_type=refresh_token&refresh_token=${refreshToken}`;

  return tokenRequest(body)
    .then((result) => result.json())
    .catch((err) => Promise.reject(err.status));
};


const getClientTokens = () => {
  const promise = new Promise((resolve, reject) => {
    redis.hget('sherpa', 'client_credentials')
      .then((data) => {
        if (data) {
          resolve(JSON.parse(data));
        } else {
          // If no tokens was set in redis, update from Sherpa
          getClientTokensFromSherpa()
            .then((tokens) => resolve(tokens))
            .catch(errorResolve('getClientTokens.sherpa'));
        }
      })
      .catch(errorResolve('getClientTokens.redis'));
  });

  return promise;
};


const clientAPIRequest = (path, options = {}, retrying = false) => {
  const promise = new Promise((resolve, reject) => {
    getClientTokens()
      .then((tokens) => {
        const fetchOptions = Object.assign({}, options, {
          headers: Object.assign({
            Authorization: `Bearer ${tokens.access_token}`,
          }, options.headers),
        });

        fetch(`${settings.OAUTH_DOMAIN}/api/v3/${path}`, fetchOptions)
          .then((result) => {
            if (result.status === 401 && !retrying) {
              getClientTokensFromSherpa()
                .then(() => clientAPIRequest(path, options, true))
                .then((r) => resolve(r))
                .catch(errorResolve(`clientAPIRequest.retry - ${path}`));
            } else if (result.status >= 200 && result.status <= 299) {
              result.json()
                .then((json) => resolve(json))
                .catch(
                  errorResolve(`clientAPIRequest.invalid_json - ${path}`)
                );
            } else {
              result.json()
                .then((json) => resolve(
                  {
                    error: true,
                    payload: json,
                    status: result.status,
                  }
                ))
                .catch(() => reject(new Error('sherpa error')));
            }
          })
          .catch(errorResolve(`clientAPIRequest.fetch - ${path}`));
      });
  });

  return promise;
};


const userAPIRequest =
  (tokens, path, options = {}, retrying = false) => {
    const promise = new Promise((resolve, reject) => {
      const fetchOptions = Object.assign({}, options, {
        headers: Object.assign({
          Authorization: `Bearer ${tokens.access_token}`,
        }, options.headers),
      });

      const url = path.substr(0, 4) === 'http'
        ? path
        : `${settings.OAUTH_DOMAIN}/api/v3/${path}`;

      fetch(url, fetchOptions)
        .then((result) => {
          if (result.status === 403 && !retrying) {
            reject(new Error(403));
          } else if (result.status >= 200 && result.status <= 299) {
            result.json()
              .then((json) => resolve(json))
              .catch(
                errorResolve(`userAPIRequest.invalid_json - ${path}`)
              );
          } else {
            reject(new Error('sherpa error'));
          }
        })
        .catch(errorResolve(`userAPIRequest.fetch - ${path}`));
    });

    return promise;
  };


const clientGetAPIRequest = (path) =>
  clientAPIRequest(path)
    .catch(errorResolve(`clientGetAPIRequest - ${path}`));


const clientPostAPIRequest = (path, body) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  return clientAPIRequest(path, options)
    .catch(errorResolve(`clientPostAPIRequest - ${path}`));
};


const userGetAPIRequest = (tokens, path) =>
  userAPIRequest(tokens, path);


const userPostAPIRequest = (tokens, path, body) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  return userAPIRequest(tokens, path, options);
};


const userAuthenticate = (email, password, userId = null, smsAuth = false) => {
  const promise = new Promise((resolve, reject) => {
    getUserTokensFromSherpa(email, password, userId, smsAuth)
      .then((tokens) => {
        resolve(tokens);
      })
      .catch((err) => {
        // Check if there is duplicate users in Sherpa
        if (err.message === '401' && !userId) {
          const body = {email, password};
          clientPostAPIRequest('users/auth-check/', body)
            .then((users) => {
              if (users && users.length) {
                resolve({users});
              } else {
                reject(new Error('auth-check-error'));
              }
            })
            .catch(() => {
              reject(new Error('sherpa error'));
            });
        } else {
          reject(new Error('sherpa error'));
        }
      });
  });

  return promise;
};


const userAuthenticateByAdminToken = (userId, token) => {
  const body = {
    user_id: userId,
    token,
  };
  return clientPostAPIRequest('users/auth/ratatoskr-admin-code/', body);
};


const userRefreshToken = (tokens) =>
  getUserTokensByRefreshTokenFromSherpa(tokens.refresh_token);


module.exports = {
  client: {
    get: clientGetAPIRequest,
    post: clientPostAPIRequest,
    getTokens: getClientTokens,
  },
  user: {
    authenticate: userAuthenticate,
    authenticateByAdminToken: userAuthenticateByAdminToken,
    get: userGetAPIRequest,
    post: userPostAPIRequest,
    refreshToken: userRefreshToken,
  },
};
