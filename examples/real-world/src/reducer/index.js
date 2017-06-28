import { combineReducers } from 'redux'

// get user info
export const USER_REQUEST = 'USER_REQUEST'
export const USER_SUCCESS = 'USER_SUCCESS'
export const USER_FAILURE = 'USER_FAILURE'
// get user's repos info
export const REPOS_REQUEST = 'REPOS_REQUEST'
export const REPOS_SUCCESS = 'REPOS_SUCCESS'
export const REPOS_FAILURE = 'REPOS_FAILURE'
// get repo
export const REPO_REQUEST = 'REPO_REQUEST'
export const REPO_FAILURE = 'REPO_REQUEST'
export const REPO_SUCCESS = 'REPO_SUCCESS'
// change searchType
export const CHANGE_TYPE = 'CHANGE_TYPE'

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
                data: action.response,
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
    pageIndex: 1,
}, action) => {
    switch (action.type) {
        case REPOS_REQUEST:
            return {
                ...state,
                isFetch: true,
            }
        case REPOS_SUCCESS:
            return {
                isFetch: false,
                data: [...action.repos],
                pageIndex: ++state.pageIndex
            }
        case REPOS_FAILURE:
            return {
                ...state,
                isFetch: false,
            }
        case USER_SUCCESS:
            return {
                ...state,
                pageIndex: 1,
            }
        default:
            return state
    }
}

const repo = (state = {
    isFetch: false,
    data: {}
}, action) => {
    switch (action.type) {
        case REPO_REQUEST:
            return {
                ...state,
                isFetch: true,
            }
        case REPO_SUCCESS:
            return {
                data: action.repo,
                isFetch: false,
            }
        case REPO_FAILURE:
            return {
                ...state,
                isFetch: false
            }
        default:
            return state
    }
}

const searchType = (state = 'user', action) => {
    switch (action.type) {
        case CHANGE_TYPE:
            return action.searchType
        default:
            return state
    }
}

export default combineReducers({
    user,
    repos,
    repo,
    searchType
})