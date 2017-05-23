import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import App from './container/App';
import registerServiceWorker from './registerServiceWorker';
import reducer from './reducer'
import { getPostBySubreddit } from './action'

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

// fetch
getPostBySubreddit(store.getState().selectSubreddit, store.dispatch)