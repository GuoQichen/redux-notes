import React from 'react'
import { string, shape } from 'prop-types'

const User = ({ user }) => {
    const { avatar_url, url, login, name } = user
    return (
        <div>
            <div className="imgWrapper">
                <img src={avatar_url} alt="avatar" width="100" height="100"/>
            </div>
            <a href={url}>{`${login}(${name})`}</a>
        </div>
    )
}

User.propTypes = {
    user: shape({
        avatar_url: string.isRequired,
        url: string.isRequired,
        login: string.isRequired,
        name: string.isRequired
    })
}

export default User