/**
 * @author acky.guo
 * @date 17/5/9
 */

// utils
const { combineReducers } = require('redux')

// reducers
const userReducer = require('./userReducer.js')
const categoryReducer = require('./categoryReducer.js')
const productReducer = require('./productReducer.js')

module.exports = combineReducers({
    userList: userReducer,
    categoryList: categoryReducer,
    productList: productReducer,
})