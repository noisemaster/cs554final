import React, { Component } from "react";
import redditApi from './utility/redditApi';
import RedditMessage from './RedditMessage';
import RedditPost from './RedditPost';
import DocumentTitle from 'react-document-title';

class RedditPostDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainPost: undefined,
            commentList:[]
        }
    }

    componentDidMount = async (props) => {
        const response = await redditApi.genericGetRequest(this.props.match.params['0'] + '.json/?raw_json=1');
        if (!response || !response[0] || !response[0].data || !response[0].data.children || !response[0].data.children[0]) {
            console.error('No Main Post Found!');
            return;
        }
        if (!response[1] || !response[1].data || !response[1].data.children) {
            response[1].data = {};
            response[1].data.children = []
        }
        this.setState({
            mainPost: response[0].data.children[0].data,
            commentList: response[1].data.children
        });
    }

    getTitle = () => {
        if (this.state.mainPost !== undefined) {
            return this.state.mainPost.title + " - Viewit";
        } else {
            return "Post Loading - Viewit";
        }
    }

    render() {
        return (
            <DocumentTitle title={this.getTitle()}>
                <div className="container">
                    <div className="row">
                        <RedditPost profile={false} data={this.state.mainPost} switchMainPage={this.props.switchMainPage}/>
                    </div>
                    {this.state.commentList.map( (comment) => {
                        return <RedditMessage data={comment.data} key={comment.data.id} switchMainPage={this.props.switchMainPage} kind={comment.kind} link_id={this.state.mainPost.name} nest_level={0}/>
                    })}       
                </div>
            </DocumentTitle>
        )
    }
}

export default RedditPostDisplay;