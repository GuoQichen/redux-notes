
module.exports = (state = [], action) => {
    switch (action.type) {
        case 'ADD_USER':
            return [
                ...state,
                action.payload
            ]
        case 'DEL_USER':
            return state.slice(0, action.payload).concat(state.slice(action.payload+1))
    }
}