import path from 'path';

const context = path.resolve(__dirname, 'src');

export default {
  devtool: 'eval',
  entry: './src/index',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  module: {
    loaders: [
      {
        include: path.resolve(__dirname, './src'),
        loaders: [
          'style-loader',
          'css-loader?importLoader=1&modules&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
        ],
        test: /\.css$/
      },
      {
        test: /\.js$/,
        loaders: 'babel-loader',
        exclude: /node_modules/,
        include: __dirname,
        query: {
          plugins: [
            'transform-react-jsx',
            [
              'react-css-modules'
            ]
          ]
        }
      }
    ],
  },
};
