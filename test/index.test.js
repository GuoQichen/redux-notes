const assert = require('assert')
const { action, store } = require('../index.js')

describe('redux test suits', function () {
    describe('user action', function () {
        it('#addUser', function () {
            assert.strictEqual(store.getState().userList.length, 0)
            action.addUser('acky')
            assert.strictEqual(store.getState().userList.length, 1)
            assert.strictEqual(store.getState().userList[0].name, 'acky')
        })

        it('#deleteUser', function () {
            assert.strictEqual(store.getState().userList.length, 1)
            action.deleteUser(0)
            assert.strictEqual(store.getState().userList.length, 0)
        })
    })
})