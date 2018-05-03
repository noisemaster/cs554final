import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import './App.css';

import localApi from './utility/localApi';
import redditApi from './utility/redditApi';
import PageHeader from './PageHeader';
import ListingList from './ListingList';
import SubredditQueryDisplay from './SubredditQueryDisplay';
import RedditPostDisplay from './RedditPostDisplay';
import RedditProfileDisplay from './RedditProfileDisplay';

class App extends Component {

	constructor (props, context) {
			super (props, context);
			this.state = {
				authenticated: false,
				username: undefined,
				token: undefined,
				content_data: '',
				type: 'Listing',
				redirect: false
			}
	}

	componentDidMount = async (props) => {
		if (!this.state.token) {
			try {
				let response = await localApi.configure();
				if (!response || !response.name || !response.access_token) {
					response = {};
					response.name = undefined;
					response.token = undefined;
				}
				this.setState({
					authenticated: true,
					username: response.name,
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
		if (prevState !== this.state) {
			if (!this.state.token) {
				try {
					let response = await localApi.configure();
					if (!response || !response.name || !response.access_token) {
						response = {};
						response.name = undefined;
						response.token = undefined;
					}
					this.setState({
						authenticated: true,
						username: response.name,
						token: response.access_token,
					});
					redditApi.setAccessToken(this.state.token);
				} catch (e) {
					console.error(e);
				}
			}
		}
	}

	switchMainPage = (content_data, type) => {
		this.props.history.push('/' + type + '/' + content_data);
		this.setState({
			content_data,
			type,
		});
	}

	render() {
		return (
		<div className="App">
			<div onClick={() => {localApi.refresh()}}> Click on me to Refresh </div>
			<div onClick={() => {this.setState({token: undefined, authenticated: false}); console.log("Ditched Token: " + this.state.token)}}> Ditch Current Access Token </div>
			<PageHeader username={this.state.username} authenticated={this.state.authenticated} switchMainPage={this.switchMainPage}/>
			<div className="App-intro">
				<Switch>
					<Route path='/Listing/*' render={(props) => {
						return(<ListingList {...props} switchMainPage={this.switchMainPage}/>)
					}}/>
					<Route path='/Home' render={(props) => {
						return(<ListingList {...props} data={''} switchMainPage={this.switchMainPage}/>)
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
			</div>
		</div>
		);
	}
}

export default withRouter(App);
