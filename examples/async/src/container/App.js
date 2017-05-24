import React from 'react'
import { connect } from 'react-redux'

import { selectSubreddit } from '../action'
import PostList from '../component/postList'
import SelectSubreddit from '../component/selectSubreddit'

const App = (props) => {
	const { fetch, subreddit, selectSubreddit } = props
	return (
		<div>
			<h1>Example Async</h1>
			<h2>{subreddit}</h2>
			<SelectSubreddit selectSubreddit={selectSubreddit}/>
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
	mapStateToProps,
	{ selectSubreddit }
)(App);
