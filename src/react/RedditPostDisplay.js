import React, { Component } from "react";
import redditApi from './utility/redditApi';
import Listing from './Listing';
import RedditMessage from './RedditMessage';
import RedditPost from './RedditPost';

class RedditPostDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainPost: undefined,
            commentList:[]
        }
    }

    componentDidMount = async (props) => {
        const response = await redditApi.genericGetRequest(this.props.data + '.json/?raw_json=1');
        console.log(response);
        if (!response || !response[0] || !response[0].data || !response[0].data.children || !response[0].data.children[0]) {
            console.error('No Main Post Found!');
            return;
        }
        if (!response[1] || !response[1].data || !response[1].data.children) {
            response[1].data = {};
            response[1].data.children = []
        }
        console.log(response[0].data.children[0]);
        this.setState({
            mainPost: response[0].data.children[0].data,
            commentList: response[1].data.children
        });
    }

    render() {
        return (
            <div>
                <RedditPost data={this.state.mainPost}/>
                <div/>
                {this.state.commentList.map( (comment) => {
						return <RedditMessage data={comment.data} key={comment.data.id}/>
				})}       
            </div>
        )
    }
}

export default RedditPostDisplay;