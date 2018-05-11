import React, { Component } from 'react';
import redditApi from './utility/redditApi';
import Listing from './Listing';
import DocumentTitle from 'react-document-title';

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
			return 'btn btn-primary ml-1';
		}
		return 'btn btn-outline-primary ml-1';
	}

	getMoreIfAfterExists = () => {
		if (this.state.after) {
			return (<button type="button" className="btn btn-primary mb-2" onClick={this.getNextListingList}> Get More Results </button>);
		}
	}

	getPageTitle = () => {
		if (Object.keys(this.props.match.params).length === 0 && this.props.match.params.constructor === Object) {
			return "Home - Viewit";
		}
		return this.props.match.params[0] + " - Viewit";
	}

	render() {
		return (
			<DocumentTitle title={this.getPageTitle()}>
				<main className="container">
					<div className="navbar navbar-expand-lg navbar-light justify-content-md-center">
						<div className="navbar-nav">
							<button type="button" className={this.isTypeActive('hot')} onClick={() => this.setType('hot')}> Hot </button>
							<button type="button" className={this.isTypeActive('new')} onClick={() => this.setType('new')}> New </button>
							<button type="button" className={this.isTypeActive('controversial')} onClick={() => this.setType('controversial')}> Controversial </button>
							<button type="button" className={this.isTypeActive('top')} onClick={() => this.setType('top')}> Top </button>
							<button type="button" className={this.isTypeActive('rising')}  onClick={() => this.setType('rising')}> Rising </button>
						</div>
					</div>
					{this.state.listingArray.map( (listing) => {
						return <Listing data={listing.data} key={listing.data.id} switchMainPage={this.props.switchMainPage}/>
					})}
					{this.getMoreIfAfterExists()}
				</main>
			</DocumentTitle>
		);
	}
}

export default ListingList;