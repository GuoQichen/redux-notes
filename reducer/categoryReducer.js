
module.exports = (state = [], action) => {
    switch (action.type) {
        case 'ADD_CAT':
            return [
                ...state,
                action.payload
            ]
        case 'DEL_CAT':
            return state.filter(({ _id }) => _id !== action.payload)
        default:
            return state
    }
}