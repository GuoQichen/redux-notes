/**
 * @author acky.guo
 * @date 17/5/9
 */

const { bindActionCreators } = require('redux')
const userAction = require('./userAction')
const categoryAction = require('./categoryAction')
const produtAction = require('./productAction')

module.exports = Object.assign({}, 
    userAction,
    categoryAction,
    produtAction
)