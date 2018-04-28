import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import localRequests from './utility/localApi';

class App extends Component {

  constructor (props) {
	super (props);
	this.state = {
		authenticated: false,
		username: undefined,
		token: undefined,
		url: undefined
	}
  }

  componentDidMount = async (props) => {
	if (!this.state.authenticated) {
		try {
			let response = await localRequests.configure();
			console.log(response);
			if (!response || !response.name || !response.access_token) {
				response = {};
				response.name = undefined;
				response.token = undefined;
			}
			const url = await localRequests.getUrl();
			if (!url.url) {
				console.error('Couldn\'t get valid Authorization URL');
			}
			this.setState({
				authenticated: true,
				username: response.name,
				token: response.access_token,
				url: url.url
			});
		} catch (e) {
			console.error(e);
		}
	}
  }

  render() {
	return (
	  <div className="App">
		<header className="App-header">
		  <img src={logo} className="App-logo" alt="logo" />
		  <h1 className="App-title">Welcome to React</h1>
		</header>
		<div className="App-intro">
		  <div> Username: {this.state.username} </div>
		  <div> Token: {this.state.token} </div>
		</div>
		<a href={this.state.url}> Click Me </a>
	  </div>
	);
  }
}

export default App;
