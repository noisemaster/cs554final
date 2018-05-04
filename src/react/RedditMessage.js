import React, { Component } from 'react';
import redditApi from './utility/redditApi';
import Linkify from 'linkifyjs/react';
import helper from '../helper';
import { Markup } from 'interweave';

class RedditMessage extends Component {

	constructor(props) {
		super (props);
		this.state = {
			showReplies: false,
			moreComments: undefined
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

		const showIfReplies = () => {
			let replyCount = getRepliesCount();
			if (replyCount) {
				return (<div>Replies: {getRepliesCount()}</div>);
			}
			return;
		}

		const replies = () => {
			if (this.props.data.replies) {
				if (!this.state.showReplies) {
					return (
						<div onClick={() => {this.setShowReplies(true);}}> Show Replies </div>
					);
				} else {
					return (
						<div>
							{ this.props.data.replies.data.children.map( (replies) => {
								return <RedditMessage data={replies.data} key={replies.data.id} switchMainPage={this.props.switchMainPage} showReplies={true} kind={replies.kind} link_id={this.props.link_id}/>
							})}
							<div onClick={() => {this.setShowReplies(false);}}> Collapse Replies </div>
						</div> 
					);
				}
			}
		}

		const showMore = async () => {
			const response = await redditApi.genericGetRequest('api/morechildren/?api_type=json&children=' + this.props.data.children.join(',') + '&link_id=' + this.props.link_id)
			if (!response || !response.json || !response.json.data || !response.json.data.things) {
				return;
			}
			this.setState({
				moreComments: response.json.data.things
			});
		}

		const showMoreHTML = () => {
			if (this.state.moreComments) {
				return (
					<React.Fragment>
						{ this.state.moreComments.map( (replies) => {
							return <RedditMessage data={replies.data} key={replies.data.id} switchMainPage={this.props.switchMainPage} showReplies={true} kind={replies.kind} link_id={this.props.link_id}/>
						})}           
					</React.Fragment>
				);
			}
			return (
				<div onClick={() => {showMore()}}> Click to Show More Comments </div>
			);
		}
		
		const returnMessage = () => {
			if (this.props.kind === 'more') {
				return (
					<React.Fragment>
						{showMoreHTML()}
					</React.Fragment>
				);
			}
			if (this.props.profileMessage) {
				return (
					<div>
						<div>
							<span>u/{this.props.data.author}</span> commented on 
							<span onClick={() => {this.props.switchMainPage(this.props.data.permalink.split('/').slice(0,-2).join('/'), 'RedditPostDisplay')}}> {this.props.data.link_title}</span> in 
							<span onClick={() => {this.props.switchMainPage(this.props.data.subreddit_name_prefixed, 'Listing')}}> {this.props.data.subreddit_name_prefixed}</span>
						</div>
						<div><Linkify>{this.props.data.body}</Linkify></div>
					</div>
				);
			}
			return (
				<div>
					<div onClick={() => {this.props.switchMainPage(this.props.data.author, 'RedditProfileDisplay')}}>u/{this.props.data.author}</div>
					<div> Replied {helper.timeDifferenceString(new Date(this.props.data.created_utc * 1000), Date.now())} ago</div>
					<Linkify><Markup tagName='fragment' content={this.props.data.body_html}/></Linkify>
					{showIfReplies()}
					{replies()}
				</div>
			);
		}

		return returnMessage();
	}
}

export default RedditMessage;