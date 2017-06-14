import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchUser, fetchRepos } from '../action'

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
                Type a username and hit 'Go':
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
        dispatch(fetchUser(searchValue))
            .then(() => dispatch(fetchRepos()))
    }
}

export default connect(
    (state) => state
)(Explore)