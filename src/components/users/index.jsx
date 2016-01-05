import React, { Component } from 'react';
import { connect } from 'react-redux';
import User from './user';
import css from './css';

const mapStateToProps = (appState) => {
	return { users: appState.users };
};

class Users extends Component {
	render() {
		const p = this.props;
		let rows = [];
		if (p.users.hasreceiveddata) {
			rows = Object.keys(p.users.data).map((qid) => {
				const user = p.users.data[qid];
				return (
					<User key={qid} user={user} />
				);
			});
		}
		return (
			<div className={css.users}>
				{rows}
			</div>
		);
	}
}

export default connect(mapStateToProps)(Users);
