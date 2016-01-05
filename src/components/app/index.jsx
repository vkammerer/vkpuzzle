import React, { Component } from 'react';
import css from './css';
import Nav from '../nav';
import Auth from '../auth';
import Users from '../users';
import Feedback from '../feedback';

export default class App extends Component {
	render() {
		return (
			<div className={css.app}>
				<div className={css.auth}><Auth /></div>
				<div className={css.nav}><Nav /></div>
				<div className={css.feedback}><Feedback /></div>
				<div className={css.users}><Users /></div>
				<div className={css.page} >
					{this.props.children}
				</div>
			</div>
		);
	}
}
