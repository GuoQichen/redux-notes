import {
    USER_REQUEST, USER_SUCCESS, USER_FAILURE,
    REPOS_REQUEST, REPOS_SUCCESS, REPOS_FAILURE,
    REPO_REQUEST, REPO_SUCCESS, REPO_FAILURE,
    CHANGE_TYPE
} from '../reducer'

export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0
}

export const changeType = (type) => (dispatch, getState) => {
    if (!type.match(/^user|repo$/)) throw new Error(`search type is one of user or repo, isn't ${type}`)
    dispatch({ 
        type: CHANGE_TYPE,
        searchType: type,
    })
}

export const fetchUser = (userName) => (dispatch, getState) =>  {
    dispatch({ type: USER_REQUEST })
    return fetch(`https://api.github.com/users/${userName}`)
        .then(result => 
            result.json().then(data => 
                dispatch({ 
                    type: USER_SUCCESS,
                    user: data
                }), err => 
                dispatch({
                    type: USER_FAILURE
                }))
        )
}

export const fetchReposAccordingUser = () => (dispatch, getState) => {
    const { repos_url } = getState().user.data
    if (!repos_url) return
    dispatch({ type: REPOS_REQUEST })
    return fetch(repos_url)
        .then(result => 
            result.json().then(data =>
                dispatch({
                    type: REPOS_SUCCESS,
                    repos: data
                }), err => 
                dispatch({
                    type: REPOS_FAILURE,
                })
            )
        )
}

export const fetchRepoAccordingSearch = (searchValue) => (dispatch, getState) => {
    dispatch(changeType('repo'))    
    dispatch({ type: REPO_REQUEST })
    return fetch(`https://api.github.com/repos/${searchValue}`)
        .then(result =>
            result.json().then(data =>
                dispatch({
                    type: REPO_SUCCESS,
                    repo: data
                }), err =>
                dispatch({ type: REPO_FAILURE })
            )
        )
}