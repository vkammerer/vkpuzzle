import React, { Component } from 'react';
import classNames from 'classnames';
import css from './css';

class User extends Component {
	constructor() {
		super();
	}
	render() {
		const p = this.props;
		const userClass = classNames({
			[css.user]: true,
			[css.online]: p.user.online
		});
		console.log(p.user.picture.data.url);
		const style = {
			backgroundImage: `url(${p.user.picture.data.url})`
		};
		return (
			<div
				className={userClass}
				style={ style }
			>
				{p.user.first_name}
			</div>
		);
	}
}

export default User;
