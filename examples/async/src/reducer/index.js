import { combineReducers } from 'redux'

// constant
export const CHANGE_SUBREDDIT = 'CHANGE_SUBREDDIT'
export const SUBREDDIT_REQUEST = 'SUBREDDIT_REQUEST'
export const SUBREDDIT_SUCCESS = 'SUBREDDIT_SUCCESS'
export const SUBREDDIT_FAILURE = 'SUBREDDIT_FAILURE'
export const SUBREDDIT_INVALID = 'SUBREDDIT_INVALID'

// reducer
const selectedSubreddit = (state = 'reactjs', action) => {
    switch (action.type) {
        case CHANGE_SUBREDDIT:
            return action.subreddit
        default:
            return state
    }
}

const post = (state = {
    isInvalid: false,
    posts: []
}, action) => {
    switch (action.type) {
        case SUBREDDIT_SUCCESS:
            return {
                ...state,
                posts: action.posts,
                receivedAt: action.receivedAt
            }
        case SUBREDDIT_INVALID:
            return {
                ...state,
                isInvalid: true,
            }
        default:
            return state
    }
}

const postBySubreddit = (state = {}, action) => {
    switch (action.type) {
        case SUBREDDIT_SUCCESS:
        case SUBREDDIT_INVALID:
            return {
                ...state,
                [action.subreddit]: post(state[action.subreddit], action)
            }
        default:
            return state
    }
}

const isFetch = (state = false, action) => {
    switch (action.type) {
        case SUBREDDIT_REQUEST:
            return true
        case SUBREDDIT_SUCCESS:
        case SUBREDDIT_FAILURE:
            return false
        default:
            return state
    }
}

export default combineReducers({
    selectedSubreddit,
    postBySubreddit,
    isFetch
})