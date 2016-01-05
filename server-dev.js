import path from 'path';
import express from 'express';
import webpack from 'webpack';
import config from './webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const app = express();
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
	stats: {
		chunks: false,
		colors: true
	},
	publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, './src/index.html'));
});

app.use(express.static('static'));

app.listen(8080, 'localhost', (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log('Listening at http://localhost:8080');
});
