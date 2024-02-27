import webpack from 'webpack'
import { resolve as _resolve, dirname } from 'path'
import GasPlugin from 'gas-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const env = dotenv.config({ path: _resolve(__dirname, '.env') }).parsed

const config = {
  entry: './src/main.ts',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  output: {
    filename: 'bundle.js',
    path: _resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env),
    }),
    new GasPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'appsscript.json', to: './' },
        { from: 'static', to: 'static' },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': _resolve(__dirname, 'src'),
    },
    extensions: ['.ts'],
  },
}

export default config
