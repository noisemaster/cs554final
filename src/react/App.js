import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import './App.css';

import localApi from './utility/localApi';
import redditApi from './utility/redditApi';
import PageHeader from './PageHeader';
import ListingList from './ListingList';
import SubredditQueryDisplay from './SubredditQueryDisplay';
import RedditPostDisplay from './RedditPostDisplay';
import RedditProfileDisplay from './RedditProfileDisplay';
import AddEmail from './AddEmail';

class App extends Component {

	constructor (props, context) {
		super (props, context);
		this.state = {
			authenticated: false,
			username: undefined,
			email: undefined,
			token: undefined,
			content_data: '',
			type: 'Listing',
			redirect: false
		}
	}

	componentDidMount = async (props) => {
		if (!this.state.token) {
			try {
				let authenticated = true;
				let response = await localApi.configure();
				if (!response || !response.username || !response.access_token) {
					response = {};
					response.name = undefined;
					response.token = undefined;
					response.email = undefined;
					authenticated = false;
				}
				this.setState({
					authenticated,
					username: response.username,
					email: response.email,
					token: response.access_token,
				});
				redditApi.setAccessToken(this.state.token);
				this.switchMainPage('', 'Home');
			} catch (e) {
				console.error(e);
			}
		}
	}

	componentDidUpdate = async (prevProps, prevState) => {
		if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
			if (!this.state.token) {
				try {
					let authenticated = true;
					let response = await localApi.configure();
					if (!response || !response.username || !response.access_token) {
						response = {};
						response.name = undefined;
						response.email = undefined;
						response.token = undefined;
						authenticated = false;
					}
					this.setState({
						authenticated,
						username: response.username,
						email: response.email,
						token: response.access_token,
					});
					redditApi.setAccessToken(this.state.token);
				} catch (e) {
					console.error(e);
				}
			}
		}
	}

	setEmail = (email) => {
		this.setState({
			email: email
		});
	}

	setToken = (token) => {
		this.setState({
			token
		});
	}
	
	switchMainPage = (content_data, type) => {
		this.props.history.push('/' + type + '/' + content_data);
		this.setState({
			content_data,
			type,
		});
	}

	displayIfAuthenticated = () => {
		if (this.state.authenticated) {
			return (
				<Switch>
					<Route path='/Listing/*' render={(props) => {
						return(<ListingList {...props} switchMainPage={this.switchMainPage}/>)
					}}/>
					<Route path='/Home' render={(props) => {
						return(<ListingList {...props} data={''} switchMainPage={this.switchMainPage}/>)
					}}/>
					<Route path='/Register' render={(props) => {
						return (<AddEmail {...props} email={this.state.email} setEmail={this.setEmail}/>);
					}}/>
					<Route path='/SubredditQueryDisplay/*' render={(props) => {
						return(<SubredditQueryDisplay {...props} switchMainPage={this.switchMainPage}/>)
					}}/>
					<Route path='/RedditPostDisplay/*' render={(props) => {
						return(<RedditPostDisplay {...props} switchMainPage={this.switchMainPage}/>)
					}}/>
					<Route path='/RedditProfileDisplay/*' render={(props) => {
						return(<RedditProfileDisplay {...props} switchMainPage={this.switchMainPage}/>)
					}}/>
				</Switch>
			);
		}
		return (<div> Please Log In to Continue </div>);
	}

	render() {
		return (
		<div className="App">
			<PageHeader username={this.state.username} authenticated={this.state.authenticated} setToken={this.setToken} switchMainPage={this.switchMainPage}/>
			{this.displayIfAuthenticated()}
		</div>
		);
	}
}

export default withRouter(App);
