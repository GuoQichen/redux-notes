
let categoryCount = 0
module.exports = {
    addCategory: (name) => ({
        type: 'ADD_CAT',
        payload: {
            _id: ++categoryCount,
            name,
            date: new Date()
        }
    }),
    deleteCategory: (_id) => ({
        type: 'DEL_CAT',
        payload: _id,
    })
}