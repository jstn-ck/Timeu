const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const path = require('path')
const defaultInclude = path.resolve(__dirname, 'src')


rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  devtool: 'source-map',
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    alias: {
      ['@']: path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss']
  },
};
