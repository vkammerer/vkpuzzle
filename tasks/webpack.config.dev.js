import path from 'path';
import webpack from 'webpack';

export default {
	devtool: 'cheap-module-eval-source-map',
	eslint: {
		configFile: '.eslintrc'
	},
	entry: [
		'webpack-hot-middleware/client',
		path.join(__dirname, '..', 'src', 'main')
	],
	output: {
		path: path.join(__dirname, '..', 'static'),
		filename: '[name].js'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
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
				include: path.join(__dirname, '..', 'src')
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader?modules'
			}
		]
	}
};
