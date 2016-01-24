import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import store from './store';
import actions from './actions';
import App from './components/app';
import Home from './components/home';
import Articles from './components/articles';

class Routes extends Component {
	componentWillMount() {
		store.dispatch(actions.listenToAuth());
		store.dispatch(actions.listenToArticles());
	}
	render() {
		return (
			<Provider store={store}>
				<Router>
					<Route path="/" component={App}>
						<IndexRoute component={Home} />
						<Route path="articles" component={Articles} />
					</Route>
				</Router>
			</Provider>
		);
	}
}

render(<Routes />, document.getElementById('root'));
