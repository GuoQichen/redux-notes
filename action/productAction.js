
let productCount = 0
module.exports = {
    addProduct: (name) => ({
        type: 'ADD_PRO',
        payload: {
            _id: productCount++,
            name,
            date: new Date()
        }
    }),
    deleteProduct: (_id) => ({
        type: 'DEL_PRO',
        payload: _id,
    })
}