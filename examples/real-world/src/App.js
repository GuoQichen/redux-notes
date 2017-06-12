import React, { Component } from 'react';

import Header from './container/Header'
import Detail from './container/Detail'

class App extends Component {
	render() {
		return (
			<div className="App">
				<Header />
				<hr/>
				<Detail />
			</div>
		);
	}
}

export default App;
