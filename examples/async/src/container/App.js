import React, { Component } from 'react'
import { connect } from 'react-redux'

const App = ({ state }) => {
	return (
		<div>
			<h1>Example Async</h1>
		</div>
	);
}

const mapStateToProps = state => ({ state })
export default connect(
	mapStateToProps
)(App);
