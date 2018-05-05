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
		await this.changeListingList();
	}

	componentDidUpdate = async (previousProps) => {
		if (previousProps !== this.props || this.state.listingArray.length === 0) {
			await this.changeListingList();
		}
	}

	changeListingList = async () => {
		let path = ''
		if (this.props.match && this.props.match.params && this.props.match.params['0']) {
			path = this.props.match.params['0'];
		}
		const response = await redditApi.genericGetRequest(path + '/' + this.state.type + '/.json?raw_json=1');
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
		let path = ''
		if (this.props.match && this.props.match.params && this.props.match.params['0']) {
			path = this.props.match.params['0'];
		}
		const response = await redditApi.genericGetRequest(path + '/' + this.state.type + '/.json?raw_json=1&after=' + this.state.after);
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

	isTypeActive = type => {
		if (this.state.type === type) {
			return 'nav-item nav-link active';
		}
		return 'nav-item nav-link';
	}

	getMoreIfAfterExists = () => {
		if (this.state.after) {
			return (<div onClick={this.getNextListingList}> Get More Results </div>);
		}
	}

	render() {
		return (
			<div>
				<div className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
					<div className="navbar-nav">
						<a href="#" className={this.isTypeActive('hot')} onClick={() => this.setType('hot')}> Hot </a>
						<a href="#" className={this.isTypeActive('new')} onClick={() => this.setType('new')}> New </a>
						<a href="#" className={this.isTypeActive('controversial')} onClick={() => this.setType('controversial')}> Controversial </a>
						<a href="#" className={this.isTypeActive('top')} onClick={() => this.setType('top')}> Top </a>
						<a href="#" className={this.isTypeActive('rising')}  onClick={() => this.setType('rising')}> Rising </a>
					</div>
				</div>
				<main className="container">
					{this.state.listingArray.map( (listing) => {
						return <Listing data={listing.data} key={listing.data.id} switchMainPage={this.props.switchMainPage}/>
					})}
					{this.getMoreIfAfterExists()}
				</main>
			</div>
		);
	}
}

export default ListingList;