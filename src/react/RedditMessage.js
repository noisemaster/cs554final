import React, { Component } from 'react';

class RedditMessage extends Component {

    constructor(props) {
        super (props);
        this.state = {
            showReplies: false,
        }
    }

    componentDidMount = () => {
        if (this.props.showReplies) {
            this.setState({
                showReplies: true
            });
        }
    }

    setShowReplies = (bool) => {
        if (bool) {
            this.setState({
                showReplies: true
            });
        } else {
            this.setState({
                showReplies: false
            });
        }
    }

    render() {

        const getRepliesCount = () => {
            let repliesCount = 0;
            if (this.props.data.replies) {
                repliesCount = this.props.data.replies.data.children.length;
            }
            return repliesCount;
        }

        const replies = () => {
            console.log("I am a do?");
            console.log(this.props.data.replies);
            if (this.props.data.replies) {
                console.log("I did a do");
                if (!this.state.showReplies) {
                    return (
                        <div onClick={() => {this.setShowReplies(true);}}> Show Replies </div>
                    );
                } else {
                    return (
                        <div>
                            { this.props.data.replies.data.children.map( (replies) => {
                                return <RedditMessage data={replies.data} key={replies.data.id} showReplies={true}/>
                            })}
                            <div onClick={() => {this.setShowReplies(false);}}> Collapse Replies </div>
                        </div> 
                    );
                }
            }
        }

        console.log("Message");
        console.log(this.props.data);
        return (
        <div>
            <h2>{this.props.data.title}</h2>
            <div>u/{this.props.data.author}</div>
            <div>{this.props.data.body}</div>
            <div>Replies: {getRepliesCount()}</div>
            {replies()}
        </div>
        );
    }
}

export default RedditMessage;