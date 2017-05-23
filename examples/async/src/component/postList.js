import React from 'react'

const PostList = ({ fetch, posts }) => {
    const fetchStyle =  {
        opacity: '0.5'
    }
    return (
        <ul style={ fetch ? fetchStyle : {}}>
            {
                posts.map(post => (
                    <li key={post.id}>{post.title}</li>
                ))
            }
        </ul>
    )
}

export default PostList