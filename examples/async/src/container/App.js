import React from 'react'
import { connect } from 'react-redux'

import PostList from '../component/postList'

const App = (props) => {
	const { fetch, subreddit } = props
	return (
		<div>
			<h1>Example Async</h1>
			<h2>{subreddit}</h2>
			{
				fetch && <h2>Lodding...Please wait a moment</h2>
			}
			<PostList {...props} />
		</div>
	);
}

const mapStateToProps = state => ({ 
	fetch: state.fetch,
	subreddit: state.selectSubreddit,
	posts: state.postBySubreddit[state.selectSubreddit] || []
 })

export default connect(
	mapStateToProps
)(App);
