/* global Raven */

export default () => {
  if (process.env.NODE_ENV === 'production') {
    Raven
      .config('https://76da2076dc02497e9acc6e9a838ecc30@sentry.io/98338', {
        release: 'update-version-tag-here',
      })
      .install()
  }
}
