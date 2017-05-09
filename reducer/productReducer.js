
module.exports = (state = [], action) => {
    switch (action.type) {
        case 'ADD_PRO':
            return [
                ...state,
                action.payload
            ]
        case 'DEL_PRO':
            return state.slice(0, action.payload).concat(state.slice(action.payload+1))
    }
}