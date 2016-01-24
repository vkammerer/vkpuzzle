import React, { Component } from 'react';
import classNames from 'classnames';
import css from './css';

class Friend extends Component {
	constructor() {
		super();
	}
	render() {
		const p = this.props;
		const friendClass = classNames({
			[css.friend]: true,
			[css.online]: p.friend.online
		});
		const style = {
			backgroundImage: `url(${p.friend.picture.data.url})`
		};
		return (
			<div
				className={friendClass}
				style={ style }
			>
				{p.friend.first_name}
			</div>
		);
	}
}

export default Friend;
