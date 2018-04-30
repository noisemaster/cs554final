import React, { Component } from 'react';

class RedditMessage extends Component {
    render() {
        return (
        <div>
            <div>u/{this.props.data.author}</div>
            <div>{this.props.data.body}</div>
        </div>
        );
    }
}

export default RedditMessage;