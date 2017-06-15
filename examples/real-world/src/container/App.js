import React, { Component } from 'react';
import { connect } from 'react-redux'

import Explore from './Explore'
import List from '../component/List'
import User from '../component/User'

import { isEmpty } from '../action'

class App extends Component {
	render() {
		const { user, repos, repo, searchType } = this.props
		const isFetchUser = user.isFetch
		const userData = user.data
		const isFetchRepos = repos.isFetch
		const reposData = repos.data
		const isFetchRepo = repo.isFetch
		const repoData = repo.data
		return (
			<div className="App">
				<Explore />
				<hr/>
				{
					isFetchUser
					? <h3>Loading...</h3>
					: isEmpty(userData) ? <h3>User is Empty</h3> : <User user={userData}/>
				}
				<hr />
				{
					isFetchRepos || isFetchRepo
					? <h3>Loading...</h3>
					: isEmpty(searchType === 'user' ? reposData : repoData) 
						? <h3>Repos is Empty</h3> 
						: <List repos={searchType === 'user' ? reposData : [repoData]} isFetch={searchType === 'user' ? isFetchUser : isFetchRepo}/>
				}
			</div>
		);
	}
}

export default connect(
	(state) => state
)(App);
