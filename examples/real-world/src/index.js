import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import rootReducer from './reducer'

import App from './container/App';

const middlewares = [thunk]

if(process.env.NODE_ENV === 'development') {
	middlewares.push(logger)
}

const store = createStore(rootReducer, applyMiddleware(...middlewares))

ReactDOM.render((
	<Provider store={store}>
		<App />
	</Provider>
), document.getElementById('root'));
registerServiceWorker();
