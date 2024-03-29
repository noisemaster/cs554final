import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import redditApi from './utility/redditApi';
import RedditPost from './RedditPost';
import RedditMessage from './RedditMessage';

class RedditProfileDisplay extends Component {

	constructor (props) {
		super(props);
		this.state = {
			listingArray: [],
			after: undefined
		}
	}

	componentDidMount = async (props) => {
		if (typeof (this.props.match.params['0']) !== 'string') {
			return;
		}
		await this.changeListingList();
	}

	componentDidUpdate = async (props) => {
		if (this.state.listingArray.length === 0) {
			await this.changeListingList();
		}
	}

	changeListingList = async () => {
		const response = await redditApi.genericGetRequest('user/' + this.props.match.params['0'] + '/.json?raw_json=1');
		if (!response.data.kind === 'Listing') {
			console.error('Invalid Type of Reddit Page');
			return;
		}
		this.setState(
			{
				listingArray: response.data.children,
				after: response.data.after
			}
		)
	};

	getNextListingList = async () => {
		const response = await redditApi.genericGetRequest('user/' + this.props.match.params['0'] + '/.json?after=' + this.state.after + '&raw_json=1');
		if (!response.data.kind === 'Listing') {
			console.error('Invalid Type of Reddit Page');
			return;
		}
		this.setState(
			{
				listingArray: this.state.listingArray.concat(response.data.children),
				after: response.data.after
			}
		)
	}

	setType = (newType) => {
		this.setState (
			{
				type: newType,
				listingArray: []
			}
		)
	};

	decipherItemType = (listing) => {
		if (listing.kind === 't3' || listing.data.name.match('/^t3_/')) {
			return (<RedditPost profile={true} data={listing.data} key={listing.data.id} switchMainPage={this.props.switchMainPage}/>);
		}
		if (listing.kind === 't1' || listing.data.name.match('/^t1_/')) {
			return (<RedditMessage data={listing.data} profileMessage={true} key={listing.data.id} switchMainPage={this.props.switchMainPage} showReplies={false}/>);
		}
		return;
	}

	getMoreIfAfterExists = () => {
		if (this.state.after) {
			return (<button type="button" className="btn btn-primary" onClick={this.getNextListingList}> Get More Results </button>);
		}
	}

	render() {

        const getProperFormat = () => {
            return this.state.listingArray.map((listing) => {
				return this.decipherItemType(listing);
            });
        }
		return (
			<DocumentTitle title={this.props.match.params['0'] + "'s profile page - Viewit"}>
				<div className="container">
					<div>
						{getProperFormat()}
					</div>
					{this.getMoreIfAfterExists()}
				</div>
			</DocumentTitle>
		);
	}
}

export default RedditProfileDisplay;