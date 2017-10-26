/* global Raven */

export default () => {
  if (process.env.NODE_ENV === 'production') {
    try {
      Raven
        .config('https://76da2076dc02497e9acc6e9a838ecc30@sentry.io/98338', {
          release: window.sherpa.version,
        })
        .install()
    } catch (error) {
      // Silently ignore if Raven initialization fails
    }
  }
}
