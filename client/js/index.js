import raven from './lib/raven'
import './lib/ios-orientationchange-fix'

import bootstrap from './core/render'

// Import base stylesheet. This will be converted to it's own .css file through
// webpack in production mode.
import '../less/index.less'


// Initialize raven
raven()

// Initiate the app
bootstrap()
