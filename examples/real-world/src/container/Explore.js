import React, { Component } from 'react'

import { connect } from 'react-redux'

import { USER_REQUEST, USER_SUCCESS, USER_FAILURE } from '../reducer'

class Explore extends Component {
    state = {
        searchValue: ''
    }

    render() {
        const { searchValue } = this.state
        const inputStyle = {
            width: '300px',
            margin: '20px 0'
        }
        return (
            <div>
                Type a username or repo full name and hit 'Go':
                <main>
                    <input
                        type="text" 
                        style={inputStyle}
                        value={searchValue}
                        onChange={e => this.setState({ searchValue: e.target.value })}
                    />
                    <button onClick={this.search}>Go!</button>
                </main>
            </div>
        )
    }

    search = () => {
        const { searchValue } = this.state
        const { dispatch } = this.props
        dispatch({ type: USER_REQUEST })
        fetch(`https://api.github.com/users/${searchValue}`)
            .then(result => result.json().then(data => dispatch({ 
                type: USER_SUCCESS,
                user: data
            })))
            .catch(err => dispatch({
                type: USER_FAILURE
            }))
    }
}

export default connect(
    (state) => state
)(Explore)