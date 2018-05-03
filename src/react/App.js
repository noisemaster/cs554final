import React, { Component } from 'react';
import './App.css';

import localApi from './utility/localApi';
import redditApi from './utility/redditApi';
import PageHeader from './PageHeader';
import ListingList from './ListingList';
import SubredditQueryDisplay from './SubredditQueryDisplay';
import RedditPostDisplay from './RedditPostDisplay';
import RedditProfileDisplay from './RedditProfileDisplay';

class App extends Component {

	constructor (props) {
			super (props);
			this.state = {
				authenticated: false,
				username: undefined,
				token: undefined,
				content_data: '',
				type: 'Listing'
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
				this.switchMainPage('', 'Listing');
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
			this.setState ({
				content_data,
				type
			});
	}

	getMainContent = () => {
		if (this.state.type === 'Listing') {
			return (
				<ListingList data={this.state.content_data} switchMainPage={this.switchMainPage}/>
			)
		}
		if (this.state.type === 'SubredditQueryDisplay') {
			return (
				<SubredditQueryDisplay data={this.state.content_data} switchMainPage={this.switchMainPage}/>
			);
		}
		if (this.state.type === 'RedditPostDisplay') {
			return (
				<RedditPostDisplay data={this.state.content_data} switchMainPage={this.switchMainPage}/>
			);
		}
		if (this.state.type === 'RedditProfileDisplay') {
			return (
				<RedditProfileDisplay data={this.state.content_data} switchMainPage={this.switchMainPage}/>
			);
		}
	}

	render() {
		return (
		<div className="App">
			<div onClick={() => {localApi.refresh()}}> Click on me to Refresh </div>
			<div onClick={() => {this.setState({token: undefined, authenticated: false}); console.log("Ditched Token: " + this.state.token)}}> Ditch Current Access Token </div>
			<PageHeader username={this.state.username} authenticated={this.state.authenticated} switchMainPage={this.switchMainPage}/>
			<div className="App-intro">
				{this.getMainContent()}
			</div>
		</div>
		);
	}
}

export default App;
