import React, { Component } from 'react';
import localRequests from './utility/localApi';
import RedditSearchBar from './RedditSearchBar';
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';


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

	logOut = () => {
		const cookies = new Cookies();
		cookies.remove('cs554RedditReader', {path: '/'});
		this.props.setToken('');
	}

	displayLogin = () => {
		if (this.props.authenticated && this.props.username) {
			return (
				<React.Fragment>
					<li className='nav-item'>
						<Link className='nav-link' to='/Register'> Settings </Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to={'/RedditProfileDisplay/' + this.props.username}> {this.props.username} </Link>
					</li>
					<li className='nav-item'>
						<div className='nav-link' onClick={this.logOut}> Log Out </div>
					</li>			
				</React.Fragment>
			)
		}
		if (this.state.url) {
			return (
				<li className="nav-item">
					<div><a className="nav-link" href={this.state.url}> Log In </a></div>
				</li>
			)
		}
		return (
			<div> Unable to Log In </div>
		)
	}

	render() {
		return (
		<nav className="navbar navbar-expand-lg sticky-top navbar-dark" style={this.props.color !== null ? {backgroundColor: this.props.color.color} : {backgroundColor: '#343a40'}}>
			<div className="navbar-brand mb-0 h1">ViewIt</div>
			<ul className="navbar-nav mr-auto">
				<li className="nav-item">
					<Link className="nav-link" to="/Home"> Home </Link>
				</li>
				{this.displayLogin()}
			</ul>
			<RedditSearchBar switchMainPage={this.props.switchMainPage}/>
		</nav>
		)
	}
}

export default PageHeader;