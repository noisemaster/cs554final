import React, { Component, Fragment } from 'react';
import redditApi from './utility/redditApi';
import Linkify from 'linkifyjs/react';
import helper from '../helper';
import {Link} from 'react-router-dom';
import Interweave from 'interweave';
import LinkTransform from './InterweaveLinkTransform';

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
						<button onClick={() => {this.setShowReplies(true)}} type="button" className="btn btn-primary">Show {getRepliesCount() === 1 ? '1 Reply' : `${getRepliesCount()} Replies`}</button>
					);
				} else {
					return (
						<div>
							{ this.props.data.replies.data.children.map( (replies) => {
								return <RedditMessage data={replies.data} key={replies.data.id} switchMainPage={this.props.switchMainPage} showReplies={true} kind={replies.kind} link_id={this.props.link_id} nest_level={this.props.nest_level+1}/>
							})}
							<button type="button" className="btn btn-danger" onClick={() => {this.setShowReplies(false);}}> Collapse Replies </button>
						</div> 
					);
				}
			}
		}

		const showMore = async () => {
			const response = await redditApi.genericGetRequest('api/morechildren/?api_type=json&children=' + this.props.data.children.join(',') + '&raw_json=1&link_id=' + this.props.link_id)
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
					<Fragment>
						{ this.state.moreComments.map( (replies) => {
							return <RedditMessage data={replies.data} key={replies.data.id} switchMainPage={this.props.switchMainPage} showReplies={true} kind={replies.kind} link_id={this.props.link_id} nest_level={this.props.nest_level+1}/>
						})}           
					</Fragment>
				);
			}
			return (
				<button className="btn btn-primary mb-3" onClick={() => {showMore()}}> Click to Show More Comments </button>
			);
		}
		
		const returnMessage = () => {
			if (this.props.kind === 'more') {
				return (
					<Fragment>
						{showMoreHTML()}
					</Fragment>
				);
			}
			if (this.props.profileMessage) {
				return (
					<div className="media">
						<div className="media-body">
							u/{this.props.data.author} commented on 
							<Link to={'/RedditPostDisplay/' + this.props.data.permalink.split('/').slice(0,-2).join('/')}> {this.props.data.link_title}</Link> in 
							<Link to={'/Listing/' + this.props.data.subreddit_name_prefixed}> {this.props.data.subreddit_name_prefixed}</Link>
							<div>
								<Linkify>
									<Interweave tagname='fragment' transform={LinkTransform} content={this.props.data.body_html}/>
								</Linkify>
							</div>
						</div>
					</div>
				);
			}
			return (
				<div className={`media pl-${this.props.nest_level}`}>
					<div className="media-body">
						<h5><Link to={'/RedditProfileDisplay/' + this.props.data.author}>u/{this.props.data.author}</Link> replied {helper.timeDifferenceString(new Date(this.props.data.created_utc * 1000), Date.now())} ago</h5>
						<Linkify><Interweave tagName='fragment' transform={LinkTransform} content={this.props.data.body_html}/></Linkify>
						{replies()}
					</div>
				</div>
			);
		}

		return returnMessage();
	}
}

export default RedditMessage;