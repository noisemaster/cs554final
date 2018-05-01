import React, { Component } from 'react';
import redditApi from './utility/redditApi';
import Listing from './Listing';
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
		console.log("Hi" + this.props.data);
		if (typeof (this.props.data) !== 'string') {
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
		console.log("Trying to Change Listing");
		console.log("Trying to change to: " + this.state.type);
		const response = await redditApi.genericGetRequest('user/' + this.props.data + '/.json?raw_json=1');
		console.log(response);
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
		const response = await redditApi.genericGetRequest(this.props.data + '/.json?after=' + this.state.after + '&raw_json=1');
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
		console.log(newType);
		this.setState (
			{
				type: newType,
				listingArray: []
			}
		)
	};

	render() {

        const getProperFormat = () => {
            return (this.state.listingArray.map((listing) => {
                if (listing.kind === 't3' || listing.data.name.match('/^t3_/')) {
                    return <RedditPost data={listing.data} key={listing.data.id} switchMainPage={this.props.switchMainPage}/>
                }
                if (listing.kind === 't1') {
                    return <RedditMessage data={listing.data} key={listing.data.id} switchMainPage={this.props.switchMainPage} showReplies={false}/>
				}
				console.log(listing  || listing.data.name.match('/^t1_/'));
            }));
        }
		return (
			<div>
				<div>
					{getProperFormat()}
				</div>
				<div onClick={this.getNextListingList}> Get More Results </div>
			</div>
		);
	}
}

export default RedditProfileDisplay;