import { SUBREDDIT_REQUEST, SUBREDDIT_SUCCESS, CHANGE_SUBREDDIT } from '../reducer'
import getSubreddit from '../api'

// 基本的actionCreator
const getPosts = () =>  ({
    type: SUBREDDIT_REQUEST,
})

const changeSubreddit = (subreddit) => ({
    type: CHANGE_SUBREDDIT,
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
    if(posts.kind !== 'Listing') throw new Error('posts isn\'t list')
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

// 异步的action，封装了异步获取数据的过程，从request到获取成功后数据的处理，返回promise方便async flow
export const getPostBySubreddit = subreddit => (dispatch, getState) => {
    subreddit = subreddit || getState().selectSubreddit
    dispatch(getPosts())
    return getSubredditAsync(subreddit).then(posts => {
        dispatch(receivePost({ posts, subreddit }))
        return subreddit
    })
}

// 比getPostBySubreddit更高级的api，包括对获取频率的限制，获取后的一些状态的改变
export const refresh = subreddit => (dispatch, getState) => {
    const isFetch = getState().fetch
    if(isFetch) return console.error('your refresh too often')
    dispatch(getPostBySubreddit(subreddit))
        .then(subreddit => {
            dispatch(changeSubreddit(subreddit))
        })
}

// 改变subreddit后，在这边选择是重新获取还是使用缓存
export const selectSubreddit = subreddit => (dispatch, getState) => {
    const subredditPost = getState().postBySubreddit[subreddit]
    if(subredditPost) {
        dispatch(changeSubreddit(subreddit))
    } else {
        refresh(subreddit)(dispatch, getState)
    }
}

