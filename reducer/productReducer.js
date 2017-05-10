
module.exports = (state = [], action) => {
    switch (action.type) {
        case 'ADD_PRO':
            return [
                ...state,
                action.payload
            ]
        case 'DEL_PRO':
            return state.filter(({ _id }) => _id !== action.payload)
        default:
            return state
    }
}