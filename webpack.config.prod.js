import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
	eslint: {
		configFile: '.eslintrc'
	},
	entry: [
		path.join(__dirname, 'src', 'main')
	],
	output: {
		path: path.join(__dirname, 'static'),
		filename: '[name].js'
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false
			}
		}),
		new ExtractTextPlugin('[name].css')
	],
	resolve: {
		extensions: ['', '.js', '.jsx', '.css']
	},
	module: {
		preLoaders: [
			{
				test: /\.js|\.jsx$/,
				loader: 'eslint-loader',
				exclude: ['node_modules']
			}
		],
		loaders: [
			{
				test: /\.js|\.jsx$/,
				loaders: ['babel'],
				include: path.join(__dirname, 'src')
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules')
			}
		]
	}
};
