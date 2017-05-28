import React from 'react'
import { connect } from 'react-redux'

import { selectSubreddit, refresh } from '../action'
import PostList from '../component/postList'
import SelectSubreddit from '../component/selectSubreddit'

const App = (props) => {
	const { fetch, subreddit, dispatch, selectSubreddit, posts = [], lastUpdate, refresh } = props
	return (
		<div>
			<h1>Example Async</h1>
			<h2>{subreddit}</h2>
			<SelectSubreddit selectSubreddit={selectSubreddit}/>
			{
				fetch && <h2>Lodding...Please wait a moment</h2>
			}
			<h3 style={{ display: 'flex'}}>
				fetch data time is {lastUpdate ? lastUpdate.toLocaleTimeString() : ''}
				<button onClick={() => refresh(subreddit)}>refresh</button>
			</h3>
			<PostList fetch={fetch} posts={posts} />
		</div>
	);
}

const mapStateToProps = state => {
	const subreddit = state.postBySubreddit[state.selectSubreddit]
	return { 
		fetch: state.fetch,
		subreddit: state.selectSubreddit,
		lastUpdate: subreddit && subreddit.receivedAt,
		posts: subreddit && subreddit.posts
	}
}

export default connect(
	mapStateToProps,
	{ selectSubreddit, refresh }
)(App);
