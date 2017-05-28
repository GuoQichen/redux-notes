import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'

// middleware
import thunk from 'redux-thunk'
import logger from 'redux-logger'

// component
import App from './container/App';
import reducer from './reducer'
import { getPostBySubreddit } from './action'

const middleware = [ thunk ]
if (process.env.NODE_ENV === 'development') {
    middleware.push(logger)
}
const store = createStore(reducer, applyMiddleware(...middleware))

store.dispatch(getPostBySubreddit())

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'));
registerServiceWorker();
