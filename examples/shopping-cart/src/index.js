import ReactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import reducer from './reducer'
import App from './container/App'
import thunk from 'redux-thunk'


const store = createStore(reducer, applyMiddleware(logger))


ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'))