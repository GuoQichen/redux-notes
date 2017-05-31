import { 
    SUBREDDIT_REQUEST, 
    SUBREDDIT_SUCCESS, 
    CHANGE_SUBREDDIT, 
    SUBREDDIT_INVALID
} from '../reducer'
import getSubreddit from '../api'

// 基本的actionCreator
const getPosts = () =>  ({
    type: SUBREDDIT_REQUEST,
})

export const changeSubreddit = (subreddit) => ({
    type: CHANGE_SUBREDDIT,
    subreddit
})

export const setInvalid = (subreddit) => ({
    type: SUBREDDIT_INVALID,
    subreddit
})

// 模拟异步获取数据
const getSubredditAsync = subreddit => Promise.resolve({ then(onFulfilled, onRejected) {
    getSubreddit(subreddit)((data) => {
        onFulfilled(data)
    }, 1000)
}})

// 异步获取数据成功后的actionCreator, 在这里对收到的数据进行处理，然后经过reducer合并进state tree
export const receivePost = ({ posts, subreddit }) => {
    const result = posts.data.children.map(post => ({
        id: post.data.id,
        title: post.data.title,
    }))
    return {
        type: SUBREDDIT_SUCCESS,
        posts: result,
        receivedAt: new Date(),        
        subreddit
    }
}

const isNeedFetch = state => {
    const { selectedSubreddit, postBySubreddit, isFetch } = state
    const posts = postBySubreddit[selectedSubreddit]
    const isInvalid = posts && posts.isInvalid
    if(!posts) return true
    if(isFetch) return false
    return isInvalid
}

// 异步的action，封装了异步获取数据的过程，从request到获取成功后数据的处理，返回promise方便async flow
export const getPostBySubreddit = (subreddit) => (dispatch, getState) => {
    dispatch(getPosts())
    return getSubredditAsync(subreddit)
            .then(posts => {
                dispatch(receivePost({ posts, subreddit }))
                return subreddit
            })
}

export const getPostIfNeed = (subreddit) => (dispatch, getState) => {
    const state = getState()
    if(!isNeedFetch(state)) return
    dispatch(getPostBySubreddit(subreddit))
}

