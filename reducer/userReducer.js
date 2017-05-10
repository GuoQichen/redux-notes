
module.exports = (state = [], action) => {
    switch (action.type) {
        case 'ADD_USER':
            return [
                ...state,
                action.payload
            ]
        case 'DEL_USER':
            return state.filter(({ _id }) => _id !== action.payload)
        default:
            return state
    }
}