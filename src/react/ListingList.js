import React, { Component } from 'react';
import redditApi from './utility/redditApi';
import Listing from './Listing';


class ListingList extends Component {
	constructor (props) {
		super(props);
		this.state = {
			type: 'hot',
			listingArray: [],
			index: 0,
			after: undefined
		}
	}

	componentDidMount = async (props) => {
		if (typeof (this.props.data) !== 'string') {
			return;
		}
		await this.changeListingList();
	}

	componentDidUpdate = async (previousProps) => {
		if (previousProps !== this.props || this.state.listingArray.length === 0) {
			await this.changeListingList();
		}
	}

	changeListingList = async () => {
		const response = await redditApi.genericGetRequest(this.props.data + '/' + this.state.type + '/.json');
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
		const response = await redditApi.genericGetRequest(this.props.data + '/' + this.state.type + '/.json?after=' + this.state.after);
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

	render() {
		return (
			<div>
				<div>
					<div onClick={() => this.setType('hot')}> Hot </div>
					<div onClick={() => this.setType('new')}> New </div>
					<div onClick={() => this.setType('controversial')}> Controversial </div>
					<div onClick={() => this.setType('top')}> Top </div>
					<div onClick={() => this.setType('rising')}> Rising </div>
				</div>
				<div>
					{this.state.listingArray.map( (listing) => {
						return <Listing data={listing.data} key={listing.data.id} switchMainPage={this.props.switchMainPage}/>
					})}
				</div>
				<div onClick={this.getNextListingList}> Get More Results </div>
			</div>
		);
	}
}

export default ListingList;