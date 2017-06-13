import React, { Component } from 'react';
import { connect } from 'react-redux'

import Explore from './Explore'
import List from '../component/List'
import User from '../component/User'

class App extends Component {
	render() {
		const { user, isFetch } = this.props
		return (
			<div className="App">
				<Explore />
				<hr/>
				{
					isFetch
					? <User user={user}/>
					: this.isEmpty(user)
					? <h3>Empty</h3>
					: <h3>Loading...</h3>
				}
				<hr />
				<List />
			</div>
		);
	}

	isEmpty = (obj) => {
		return Object.keys(obj).length === 0
	}
}

export default connect(
	(state) => ({
		user: state.user.data,
		isFetch: state.user.isFetch
	})
)(App);
