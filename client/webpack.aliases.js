/* eslint-disable */

/*
  In order to get eslint to use webpack aliases when determining if a import
  is valid, the exported webpack config can not be a function as we use in this
  project. Therefore we create this "mock" webpack config only for the path
  aliases. This config is imported into the webpack config and used as
  resolve.alias. It is also defined as the webpack configuration in
  .eslintrc.
*/

const path = require('path');

module.exports = {
  resolve: {
    alias: {
      core: path.join(__dirname, 'js', 'core'),
      lib: path.join(__dirname, 'js', 'lib'),
      modules: path.join(__dirname, 'js', 'modules'),
      'shared-components': path.join(__dirname, 'js', 'shared-components'),

      // This is to force SemanticUI to use our local theme configuration
      '../../theme.config$': path.join(
        __dirname, 'less/semantic-theme/theme.config'
      ),
    },
  },
};
