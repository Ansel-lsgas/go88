const path = require('path');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: () => {
    const entry = {};

    glob.sync(path.resolve(__dirname, './src/js/pages/*.js')).forEach((file) => {
      const name = path.basename(file, '.js');
      entry[name] = file;
    });

    return entry;
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './src/js/bundles/'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  mode: 'development',
  devtool: 'source-map',
  optimization: {
    minimize: false,
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};
