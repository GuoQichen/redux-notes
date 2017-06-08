/**
 * @author acky.guo
 * @date 17/5/9
 */

const { createStore, bindActionCreators, applyMiddleware } = require('redux')
const reducer = require('./reducer')
const actionCreator = require('./action')

// test middleware
const logger = ({ dispatch, getState }) => next => action => {
    console.log('trigger logger')
    console.log('prevState: ', getState())
    console.log('action: ', action)
    // invoke original dispatch, but will cause infinite loop
    // dispatch({ type: 'TEST_ACTION' }) 
    const result = next(action)
    console.log('currentState: ', getState())
    return result // this result will be store.dispatch() result, default return action 
}

const anotherMiddleware = dispatch => next => action => {
    console.log('trigger anothermiddleware')
    return next(action)
}

const middlewares = [logger, anotherMiddleware]

const store = createStore(reducer, applyMiddleware(...middlewares))

const action = bindActionCreators(actionCreator, store.dispatch)

const logState = () => {
    console.log(store.getState())
    console.log(new Array(50).fill('-').join(''))
}

store.subscribe(() => {
    // logState()
})

const result = store.dispatch({ type: 'TEST_ACTION'}) // dispatch would return action 

exports.action = action
exports.store = store