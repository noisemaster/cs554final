import React, { Component } from 'react';
import redditApi from './utility/redditApi';

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
			return (
				<div>
					<h2>{this.props.data.title}</h2>
					<div onClick={() => {this.props.switchMainPage(this.props.data.author, 'RedditProfileDisplay')}}>u/{this.props.data.author}</div>
					<div>{this.props.data.body}</div>
					<div>Replies: {getRepliesCount()}</div>
					{replies()}
				</div>
			);
		}

		return returnMessage();
	}
}

export default RedditMessage;