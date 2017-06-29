const createReducer = (initState, actionHandles) => (state = initState, action) => {
    if (actionHandles.hasOwnProperty(action.type)) {
        return actionHandles[action.type](state, action)
    } else {
        return state
    }
}

export default createReducer