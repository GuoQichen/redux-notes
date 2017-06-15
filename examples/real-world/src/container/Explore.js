import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
    fetchUser, fetchReposAccordingUser, fetchRepoAccordingSearch
} from '../action'

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
                        onKeyUp={this.hanldEnter}
                    />
                    <button onClick={this.search}>Go!</button>
                </main>
            </div>
        )
    }

    search = () => {
        const { searchValue } = this.state
        const { dispatch } = this.props
        if (this.isSearchRepo()) {
            dispatch(fetchRepoAccordingSearch(searchValue))
        } else {
            dispatch(fetchUser(searchValue))
                .then(() => dispatch(fetchReposAccordingUser()))
        }
    }

    hanldEnter = (e) => {
        if (e.keyCode === 13) {
            this.search()
        }
    }

    isSearchRepo = () => {
        const { searchValue } = this.state
        if (searchValue.match(/\w+\/\w+/)) return true
        return false
    }
}

export default connect(
    (state) => state
)(Explore)