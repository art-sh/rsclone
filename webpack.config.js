const path = require('path');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const styleLoaders = (extendedLoader) => {
  const loaders = [
    MiniCssExtractPlugin.loader,
    'css-loader',
  ];

  if (extendedLoader) loaders.push(extendedLoader);

  return loaders;
};

const optimizations = () => {
  const config = {};

  if (isProd) {
    config.minimizer = [
      new TerserWebpackPlugin({
        parallel: true,
      }),
      new OptimizeAssetsWebpackPlugin(),
    ];
  }

  return config;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    frontend: ['@babel/polyfill', './app.js'],
    test: `mocha-loader!${path.resolve(__dirname, 'test', 'test.js')}`,
    notFound: './components/Render/components/Not-found/app.js',
  },
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'source-map' : false,
  optimization: optimizations(),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: (module) => {
      if (['frontend', 'test', 'notFound'].includes(module.chunk.name)) return `[name]/assets/js/app${isProd ? '~[hash]' : ''}.js`;
    },
    publicPath: '/',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@helpers': path.resolve(__dirname, 'src/helpers'),
      '@games': path.resolve(__dirname, 'src/components/Games'),
    },
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    overlay: true,
    compress: true,
    stats: 'errors-only',
    writeToDisk: false,
    hot: true,
    inline: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
        },
      },
      {
        test: /\.css$/,
        use: styleLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: styleLoaders('sass-loader'),
      },
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
      {
        test: /\.(jpg|jpeg|png|svg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'frontend/assets/img',
          },
        },
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'frontend/assets/fonts',
          },
        },
      },
      {
        test: /\.(mp3|aac|ogg)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'frontend/assets/sound',
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'index.html',
      minify: isProd,
      favicon: 'assets/img/icons/favicon.png',
      chunks: ['frontend'],
    }),
    new HTMLWebpackPlugin({
      filename: 'test.html',
      minify: isProd,
      favicon: 'assets/img/icons/favicon.png',
      chunks: ['test'],
    }),
    new HTMLWebpackPlugin({
      filename: '404.html',
      minify: isProd,
      favicon: 'assets/img/icons/favicon.png',
      chunks: ['notFound'],
      template: 'components/Render/components/Not-found/assets/404.html',
    }),
    new MiniCssExtractPlugin({
      filename: `[name]/assets/css/style${isProd ? '~[hash]' : ''}.css`,
    }),
    new ESLintPlugin({
      threads: true,
      // fix: true,
    }),
  ],
};
