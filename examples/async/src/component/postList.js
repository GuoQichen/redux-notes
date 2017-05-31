import React from 'react'
import { bool, array } from 'prop-types'

const PostList = ({ isFetch, posts }) => {
    const fetchStyle =  isFetch ? {
        opacity: '0.5'
    } : {}
    return (
        <ul style={fetchStyle}>
            {
                posts.map(post => (
                    <li key={post.id}>{post.title}</li>
                ))
            }
        </ul>
    )
}

PostList.propTypes = {
    isFetch: bool.isRequired,
    posts: array.isRequired
}

export default PostList