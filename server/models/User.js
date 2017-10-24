'use strict';

const settings = require('../lib/settings');
const sherpa = require('../lib/sherpa');


const User = () => {
  const self = Object.assign({}, {
    id: null,

    name: null,
    firstName: null,
    lastName: null,
    email: null,
    birthDate: null,

    OAuthTokens: null,

    getAPIRepresentation() {
      return {
        id: self.id,
      };
    },

    /**
     ** Communication with Sherpa
     ** */

    setTokens(tokens) {
      self.OAuthTokens = Object.assign({}, tokens);
      return self;
    },

    sherpaRequest(path, method = 'GET', body = null, retrying = false) {
      const promise = new Promise((resolve, reject) => {
        const req = method === 'GET'
          ? sherpa.user.get(self.OAuthTokens, path)
          : sherpa.user.post(self.OAuthTokens, path, body);

        req
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            // Access token may be expired, try to refresh it
            if (err === 403 && !retrying) {
              sherpa.user.refreshToken(self.OAuthTokens)
                .then((tokens) => {
                  if (tokens) {
                    self.setTokens(tokens);
                    self.sherpaRequest(path, method, body, true)
                      .then((res) => {
                        resolve(res);
                      })
                      .catch((e) => reject(e));
                  } else {
                    resolve();
                  }
                })
                .catch((e) => reject(e));
            } else {
              reject(err);
            }
          });
      });

      return promise;
    },

    loadSherpaData() {
      if (!self.OAuthTokens || !self.OAuthTokens.access_token) {
        throw new Error(
          'Unable to load Sherpa data because OAuth token is not set'
        );
      }

      const promise = new Promise((resolve, reject) => {
        self.sherpaRequest(`${settings.OAUTH_DOMAIN}/api/v3/users/me/`)
          .then((data) => {
            if (!data) {
              self.destroy();
              resolve(self);
            }
            if (self.id && data.id !== self.id) {
              // The resulting user from Sherpa has a different ID than
              // the requesting user
              reject(new Error('bad user data'));
            }

            // UPDATE DATA ON SELF
            // Object.assign(self, mapSherpaUser(data));
          })
          .catch((err) => {
            if (err === 401) {
              self.destroy();
              resolve(self);
            } else {
              reject(err);
            }
          });
      });

      return promise;
    },

    update(data) {
      Object.assign(self, data);
      return self;
    },

    destroy() {
      Object.keys(self).forEach((key) => {
        if (typeof self[key] !== 'function') {
          self[key] = null;
        }
      });
      return self;
    },
  });

  return self;
};


module.exports = User;
