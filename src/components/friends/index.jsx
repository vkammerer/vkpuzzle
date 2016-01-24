import React, { Component } from 'react';
import { connect } from 'react-redux';
import Friend from './friend';
import css from './css';

const mapStateToProps = (appState) => {
	return { friends: appState.friends };
};

class Friends extends Component {
	render() {
		const p = this.props;
		let rows = [];
		if (p.friends.hasreceiveddata) {
			rows = Object.keys(p.friends.data).map((qid) => {
				const friend = p.friends.data[qid];
				return (
					<Friend key={qid} friend={friend} />
				);
			});
		}
		return (
			<div className={css.friends}>
				{rows}
			</div>
		);
	}
}

export default connect(mapStateToProps)(Friends);
