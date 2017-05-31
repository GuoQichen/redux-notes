import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { changeSubreddit, setInvalid, getPostIfNeed } from '../action'
import PostList from '../component/PostList'
import Picker from '../component/Picker'

class App extends PureComponent {

	componentDidMount() {
		const { subreddit, dispatch } = this.props		
		dispatch(getPostIfNeed(subreddit))
	}

	handleRefresh = () => {
		const { subreddit, dispatch } = this.props
		dispatch(setInvalid(subreddit))
	}

	handleChange = (subreddit) => {
		const { dispatch } = this.props
		dispatch(changeSubreddit(subreddit))
	}

	render() {
		const { isFetch, subreddit, posts = [], lastUpdate } = this.props		
		return (
			<div>
				<h1>Example Async</h1>
				<h2>{subreddit}</h2>
				<Picker 
					onChange={this.handleChange}
					options={['reactjs', 'nodejs']}
				/>
				{isFetch && <h2>Lodding...Please wait a moment</h2>}
				<h3 style={{ display: 'flex'}}>
					fetch data time is {lastUpdate ? lastUpdate.toLocaleTimeString() : ''}
					<button onClick={this.handleRefresh}>refresh</button>
				</h3>
				<PostList isFetch={isFetch} posts={posts} />
			</div>
		);
	}
}

const mapStateToProps = state => {
	const subreddit = state.postBySubreddit[state.selectedSubreddit]
	return { 
		isFetch: state.isFetch,
		subreddit: state.selectedSubreddit,
		lastUpdate: subreddit && subreddit.receivedAt,
		posts: subreddit && subreddit.posts
	}
}

export default connect(mapStateToProps)(App);
