import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import App from './container/App';
import registerServiceWorker from './registerServiceWorker';
import reducer, { SELECT_SUBREDDIT } from './reducer'

const middleware = [ thunk ]
if (process.env.NODE_ENV === 'development') {
    middleware.push(logger)
}
const store = createStore(reducer, applyMiddleware(...middleware))
ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'));
registerServiceWorker();

// tempory test 
store.dispatch({
    type: SELECT_SUBREDDIT,
    subreddit: 'nodejs'
})