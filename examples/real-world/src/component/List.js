import React, { Component } from 'react'

export default class List extends Component {
    render() {
        const { repos, isFetch, children } = this.props
        const containerStyle = {
            margin: '20px 0',
            opacity: isFetch ? 0.4 : 1,
        }
        return (
            <div style={containerStyle}>
                {
                    repos.map(repo => (
                        <div key={repo.name}>
                            <h4>
                                <a href={repo.html_url}>{repo.name}</a>
                            </h4>
                            <p>{repo.description || `no description`}</p>
                        </div>
                    ))
                }
                <div className="list-footer">
                    {
                        children
                    }
                </div>
            </div>
        )
    }
}