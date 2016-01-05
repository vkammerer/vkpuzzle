import React, { Component } from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import store from '../../store';
import actions from '../../actions';
import App from '../app';
import Home from '../home';
import Articles from '../articles';

export class Routes extends Component {
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
