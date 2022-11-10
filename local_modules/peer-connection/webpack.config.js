const { resolve } = require('path')

const DeclarationBundlerPlugin = require('types-webpack-bundler')

const babelOptions = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: 3,
    }],
    '@babel/preset-typescript',
  ],
}

module.exports = {
  mode: 'development',
  entry: resolve(__dirname, 'src', 'peer_connection.ts'),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'peer-connection.js',
    library: {
      name: 'PeerConnection',
      type: 'umd',
      export: 'default',
    },
  },
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: babelOptions,
        },
        {
          loader: 'ts-loader',
        },
      ],
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: babelOptions,
        },
      ],
    }],
  },
  plugins: [
    new DeclarationBundlerPlugin({
      moduleName: '"peer-connection"',
      out: 'peer-connection.d.ts',
    }),
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
  },
}
