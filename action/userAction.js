
let userCount = 0
module.exports = {
    addUser: (name) => ({
        type: 'ADD_USER',
        payload: {
            _id: userCount++,
            name,
            date: new Date()
        }
    }),
    deleteUser: (_id) => ({
        type: 'DEL_USER',
        payload: _id,
    })
}