/*
This is our top-level component. Sub-components matching specific routes will be
contained in `this.props.children` and rendered out.
*/

import React, { Component } from 'react';

export default class Wrapper extends Component {
	render() {
		return (
			<div className="home">
				Home
			</div>
		);
	}
}
