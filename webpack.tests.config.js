const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { plugins } = require('./webpack.config');

const styleLoaders = (extendedLoader) => {
  const loaders = [
    MiniCssExtractPlugin.loader,
    'css-loader',
  ];

  if (extendedLoader) loaders.push(extendedLoader);

  return loaders;
};
module.exports = {
  entry: 'mocha-loader!./test/index.js',
  output: {
      filename: 'test.build.js',
      path: path.resolve(__dirname, 'test'),
      // publicPath: 'http://' + hostname + ':' + port + '/tests'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@helpers': path.resolve(__dirname, 'src/helpers'),
      '@games': path.resolve(__dirname, 'src/components/Games'),
    },
  },
  module: {
      rules: [
          {
              test: /(\.css|\.less)$/,
              loader: styleLoaders(),
              // exclude: [
              //     /build/
              // ]
          },
          {
            test: /\.s[ac]ss$/,
            use: styleLoaders('sass-loader'),
          },
          {
        test: /\.(mp3|aac|ogg)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'assets/sound',
          },
        },
      },
          {
              test: /(\.jpg|\.jpeg|\.png|\.gif)$/,
              loader: 'file-loader'
          }
      ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'test'),
    compress: true,
    port: 9000
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ]
};
