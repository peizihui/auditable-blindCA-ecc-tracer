/*
author:rujia
website:www.rujia.uk
version:1.0
*/

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './app/javascripts/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
	  { from: './app/tracing.html', to: "tracing.html" },
	  { from: './app/index_register.html', to: "index_register.html" },

	  { from: './app/javascripts/jquery.min.js', to: "jquery.min.js" },
	  
	  { from: './app/stylesheets/style.css', to: "style.css" },
	  { from: './app/stylesheets/normalize.min.css', to: "normalize.min.css" },
	  
	  { from: './app/fonts/roboto.css', to: "roboto.css" },
	  { from: './app/fonts/font.min.css', to: "font.min.css" },
	  { from: './app/fonts/fontawesome-webfont.woff', to: "fontawesome-webfont.woff" },
	  { from: './app/fonts/KFOlCnqEu92Fr1MmWUlfBBc4.woff2', to: "KFOlCnqEu92Fr1MmWUlfBBc4.woff2" },
	  { from: './app/fonts/KFOmCnqEu92Fr1Mu4mxK.woff2', to: "KFOmCnqEu92Fr1Mu4mxK.woff2" },
	  { from: './app/fonts/KFOmCnqEu92Fr1Mu4WxKOzY.woff2', to: "KFOmCnqEu92Fr1Mu4WxKOzY.woff2" }
	  
    ])
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      },
	  {
       test: /\.woff$/,
       use: [ 'style-loader', 'css-loader' ]
      },
	  {
       test: /\.woff2$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}
