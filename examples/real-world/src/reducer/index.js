import { combineReducers } from 'redux'

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'

const user = (state = {
    isFetch: false,
    data: {},
}, action) => {
    switch (action.type) {
        case USER_REQUEST:
            return {
                ...state,
                isFetch: true
            }
        case USER_SUCCESS:
            return {
                data: action.user,
                isFetch: false
            }
        case USER_FAILURE:
            return {
                ...state,
                isFetch: false
            }
        default:
            return state
    }
}

const repos = (state = {}, action) => {
    switch (action.type) {
        default:
            return state
    }
}

export default combineReducers({
    user,
    repos
})