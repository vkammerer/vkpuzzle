import React, { Component } from 'react';
import { Link } from 'react-router';

class Nav extends Component {
	render() {
		return (
			<div className="authpanel">
				<Link to="/">Home</Link>
				{" "}
				<Link to="/articles">Articles</Link>
			</div>
		);
	}
}

export default Nav;
