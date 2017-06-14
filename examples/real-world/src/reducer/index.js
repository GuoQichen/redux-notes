import { combineReducers } from 'redux'

export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'
export const REPO_REQUEST = 'REPO_REQUEST'
export const REPO_SUCCESS = 'REPO_SUCCESS'
export const REPO_FAILURE = 'REPO_FAILURE'

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

const repos = (state = {
    isFetch: false,
    data: [],
}, action) => {
    switch (action.type) {
        case REPO_REQUEST:
            return {
                ...state,
                isFetch: true,
            }
        case REPO_SUCCESS:
            return {
                isFetch: false,
                data: [...action.repos]
            }
        case REPO_FAILURE:
            return {
                ...state,
                isFetch: false,
            }
        default:
            return state
    }
}

export default combineReducers({
    user,
    repos
})