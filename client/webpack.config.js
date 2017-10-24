// eslint-disable-next-line
const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const BundleAnalyzer = require('webpack-bundle-analyzer')
const { getIfUtils, removeEmpty } = require('webpack-config-utils')

const aliases = require('./webpack.aliases')

const hostname = process.env.VIRTUAL_HOST || 'admin-client-assets.dnt.local'
const port = process.env.VIRTUAL_PORT || '3000'
const publicPathDev = `http://${hostname}/`
const publicPathProd = '/admin-client-assets/'
const basePath = path.resolve(__dirname, '..')
const baseOuputPath = path.resolve(basePath, 'build')


const cssApp = new ExtractTextPlugin(path.resolve(
  __dirname, 'css', 'admin-client.[hash].css'
))


const createLessRule = (extractor, fileRegexps, issuerRegexs) => ({
  use: extractor.extract({
    fallback: 'style-loader',
    use: [
      { loader: 'css-loader', options: { sourceMap: true } },
      { loader: 'less-loader', options: { sourceMap: true } },
    ],
  }),
  include: __dirname,
  test: (fileName) => {
    const match = fileRegexps
      .map((r) => fileName.match(r))
      .reduce((acc, n) => acc || !!n, false)
    return match
  },
  issuer: (issuerPath) => {
    const match = issuerRegexs
      .map((r) => issuerPath.match(r))
      .reduce((acc, n) => acc || !!n, false)
    return match
  },
})


module.exports = (env) => {
  const { ifDevelopment, ifProduction } = getIfUtils(env)

  return {
    devtool: ifDevelopment('eval-source-map', 'nosources-source-map'),
    entry: {
      app: removeEmpty([
        'babel-polyfill',
        'whatwg-fetch',
        ifDevelopment(`webpack-dev-server/client?http://${hostname}`),
        ifDevelopment('webpack/hot/only-dev-server'),
        ifDevelopment('react-hot-loader/patch'),
        path.resolve(__dirname, 'js', 'index.js'),
      ]),
    },
    output: {
      pathinfo: ifDevelopment(true),
      path: baseOuputPath,
      filename: ifProduction(
        path.join('admin-client-assets', 'js', '[name].[hash].js'),
        path.join('admin-client-assets', 'js', '[name].js')
      ),
      publicPath: ifProduction(publicPathProd, publicPathDev),
    },
    resolve: {
      extensions: ['.js', '.json', '.jsx'],
      alias: aliases.resolve.alias,
    },
    module: {
      rules: [
        // Run eslint before transpiling the js(x)-files
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          enforce: 'pre',
          use: [
            {
              loader: 'eslint-loader',
              options: { configFile: path.resolve(__dirname, '.eslintrc.js') },
            },
          ],
        },

        // JS / React .jsx
        {
          test: /\.jsx?$/,
          loaders: 'babel-loader',
          exclude: /(\/node_modules\/|test\.js|\.spec\.js$)/,
        },

        // {
        //   test: /\.less$/,
        //   loaders: removeEmpty([
        //     { loader: 'style-loader', options: { sourceMap: true } },
        //     { loader: 'css-loader', options: { sourceMap: true } },
        //     { loader: 'less-loader', options: { sourceMap: true } },
        //   ]),
        // },

        // less / CSS RULES
        // Rule.oneOf is used here to prevent that a file is matched in
        // multiple rules
        {
          test: /\.(css|less)$/,
          oneOf: removeEmpty([
            // app.css if in production mode
            ifProduction(createLessRule(cssApp, [/\.less/], [
              /js\/index\.js/,
              /less\/index\.less/,
            ])),

            // less to be included into the .js files
            // (default behaviour if in development mode)
            {
              test: /\.less$/,
              loaders: removeEmpty([
                { loader: 'style-loader', options: { sourceMap: true } },
                { loader: 'css-loader', options: { sourceMap: true } },
                { loader: 'less-loader', options: { sourceMap: true } },
              ]),
            },

            // CSS to be included into the .js files
            // (default behaviour if in development mode)
            {
              test: /\.css$/,
              loaders: removeEmpty([
                { loader: 'style-loader', options: { sourceMap: true } },
                { loader: 'css-loader', options: { sourceMap: true } },
              ]),
            },
          ]),
        },

        // SVG
        {
          test: /\.svg$/,
          issuer: /\.(js|jsx)$/,
          use: {
            loader: 'svg-inline-loader',
            options: {
              removeTags: true,
              removeSVGTagAttrs: true,
            },
          },
        },

        // Images
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: {
            loader: 'file-loader',
            query: {
              name: path.join(
                'admin-client-assets', 'img', '[name].[hash].[ext]'
              ),
            },
          },
        },

        // Fonts
        {
          test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
          issuer: /\.(s?)css$/,
          use: {
            loader: 'file-loader',
            query: {
              name: path.join(
                'admin-client-assets', 'fonts', '[name].[hash].[ext]'
              ),
            },
          },
        },
      ],
    },
    plugins: removeEmpty([
      // Use this plugin to set global constants that are parsed at compile
      // time. `NODE_ENV` is used to determine if a certain piece of code
      // should be executed, for example to only do logging in development
      // mode.
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: ifProduction('"production"', '"development"'),
        },
      }),

      // App server HTML template
      new HtmlWebpackPlugin({
        filename: ifDevelopment(
          'templates/app.html',
          path.resolve(baseOuputPath, 'templates', 'app.html')
        ),
        template: path.resolve(basePath, 'templates', 'app.html'),
        chunks: ['app'],
      }),

      // HotModuleReplacementPlugin is necessary for HMR to work
      ifDevelopment(new webpack.HotModuleReplacementPlugin()),

      // Prints more readable module names in the browser
      // console on HMR updates
      ifDevelopment(new webpack.NamedModulesPlugin()),

      // Css
      ifProduction(cssApp),

      // Minimize Lodash-build (used by Semantic-UI-React). This is coupled
      // with babel-lodash-plugin used in .babelrc
      ifProduction(new LodashModuleReplacementPlugin()),

      // Production build configuration
      ifProduction(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      })),

      // Uglify configuration for production build
      ifProduction(new webpack.optimize.UglifyJsPlugin({
        compress: {
          unused: true,
          dead_code: true,
          warnings: false,
        },
      })),

      // Analytics (Should only be used when testing with `webpack` in CLI)
      env.analyze ? new BundleAnalyzer.BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: path.resolve(
          baseOuputPath, 'assets', 'webpack-analyze.html'
        ),
      }) : undefined,
    ]),

    // webpack-dev-server configuration
    devServer: {
      host: '0.0.0.0',
      port,
      publicPath: publicPathDev,
      public: hostname,
      hot: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: false,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': (
          'GET, POST, PUT, DELETE, PATCH, OPTIONS'
        ),
        'Access-Control-Allow-Headers': (
          'X-Requested-With, content-type, Authorization'
        ),
      },
    },
  }
}
