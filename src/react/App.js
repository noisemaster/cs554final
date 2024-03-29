import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import './App.css';

import localApi from './utility/localApi';
import redditApi from './utility/redditApi';
import PageHeader from './PageHeader';
import ListingList from './ListingList';
import RedditQueryDisplay from './RedditQueryDisplay';
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
			redirect: false,
			color_choice: '',
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
					response.color_choice = null;
					authenticated = false;
				}
				this.setState({
					authenticated,
					username: response.username,
					email: response.email,
					token: response.access_token,
					color_choice: response.color_choice
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
						response.color_choice = null;
						authenticated = false;
					}
					this.setState({
						authenticated,
						username: response.username,
						email: response.email,
						token: response.access_token,
						color_choice: response.color_choice
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

	setColor = color_choice => {
		this.setState({
			color_choice: {color: color_choice}
		});
	}


	setToken = (token) => {
		this.setState({
			token
		});
	}
	
	switchMainPage = (content_data, type) => {
		if (content_data === '[deleted]') {
			return;
		}
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
						return (<AddEmail {...props} email={this.state.email} setEmail={this.setEmail} color={this.state.color_choice} setColor={this.setColor}/>);
					}}/>
					<Route path='/RedditQueryDisplay/*' render={(props) => {
						return(<RedditQueryDisplay {...props} switchMainPage={this.switchMainPage}/>)
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
		return (
			<div className="container text-center mt-3">
				<h1>Please Log In to Continue</h1>
			</div>
		);
	}

	render() {
		return (
		<div className="App">
			<PageHeader username={this.state.username} authenticated={this.state.authenticated} setToken={this.setToken} switchMainPage={this.switchMainPage} color={this.state.color_choice}/>
			{this.displayIfAuthenticated()}
		</div>
		);
	}
}

export default withRouter(App);
