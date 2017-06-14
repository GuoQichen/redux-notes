import {
    USER_REQUEST, USER_SUCCESS, USER_FAILURE,
    REPO_REQUEST, REPO_SUCCESS, REPO_FAILURE
} from '../reducer'

export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0
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

export const fetchRepos = () => (dispatch, getState) => {
    const { repos_url } = getState().user.data
    if (!repos_url) return
    dispatch({ type: REPO_REQUEST })
    return fetch(repos_url)
        .then(result => 
            result.json().then(data =>
                dispatch({
                    type: REPO_SUCCESS,
                    repos: data
                }), err => 
                dispatch({
                    type: REPO_FAILURE,
                })
            )
        )
}