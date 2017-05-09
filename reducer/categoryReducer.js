
module.exports = (state = [], action) => {
    switch (action.type) {
        case 'ADD_CAT':
            return [
                ...state,
                action.payload
            ]
        case 'DEL_CAT':
            return state.slice(0, action.payload).concat(state.slice(action.payload+1))
        default:
            return state
    }
}