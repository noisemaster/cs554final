import React, { Component } from 'react';
import localRequests from './utility/localApi';
import ListingList from './ListingList';


class PageHeader extends Component {

	constructor(props) {
		super(props);
		this.state = {
			url: undefined
		}
	}

	componentDidMount = async (props) => {
		if (!this.state.authenticated) {
			try {
				const response = await localRequests.getUrl();
				if (!response.url) {
					console.error('Couldn\'t get valid Authorization URL');
				}
				this.setState({
					url: response.url
				});
			} catch (e) {
				console.error(e);
			}
		}
	}

	displayLogin = () => {
		if (this.props.authenticated && this.props.username) {
			return (
				<div> {this.props.username} </div>
			)
		}
		if (this.state.url) {
			return (
				<div><a href={this.state.url}> Log In </a></div>
			)
		}
		return (
			<div> Unable to Log In </div>
		)
	}

	render() {
		return (
		<header>
			<div> Put an App Name Here </div>
			{this.displayLogin()}
			<ListingList url=''/>
		</header>
		)
	}
}

export default PageHeader;