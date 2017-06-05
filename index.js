/**
 * @author acky.guo
 * @date 17/5/9
 */

const { createStore, bindActionCreators } = require('redux')
const reducer = require('./reducer')
const actionCreator = require('./action')

const store = createStore(reducer)

const action = bindActionCreators(actionCreator, store.dispatch)

const logState = () => {
    console.log(store.getState())
    console.log(new Array(100).fill('-').join(''))
}

store.subscribe(() => {
    logState()
})

store.dispatch({ type: 'TEST_ACTION'}) // dispatch would return action 

exports.action = action
exports.store = store