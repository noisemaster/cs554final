import React, { Component } from 'react';
import localRequests from './utility/localApi';
import SubredditSearchBar from './SubredditSearchBar';
import { Link } from "react-router-dom";


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
				<div className="navbar-text"> {this.props.username} </div>
			)
		}
		if (this.state.url) {
			return (
				<div><a className="nav-link" href={this.state.url}> Log In </a></div>
			)
		}
		return (
			<div> Unable to Log In </div>
		)
	}

	render() {
		return (
		<nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
			<div className="navbar-brand mb-0 h1">ViewIt</div>
			<ul className="navbar-nav mr-auto">
				<li className="nav-item">
					<Link className="nav-link" to="/Home"> Home </Link>
				</li>
				<li className="nav-item">
					{this.displayLogin()}
				</li>
			</ul>
			<SubredditSearchBar switchMainPage={this.props.switchMainPage}/>
		</nav>
		)
	}
}

export default PageHeader;