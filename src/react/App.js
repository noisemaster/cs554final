import React, { Component } from 'react';
import './App.css';

import localApi from './utility/localApi';
import redditApi from './utility/redditApi';
import PageHeader from './PageHeader';

class App extends Component {

  constructor (props) {
		super (props);
		this.state = {
			authenticated: false,
			username: undefined,
			token: undefined
		}
  }

  componentDidMount = async (props) => {
	if (!this.state.authenticated) {
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
			console.log(await redditApi.getHomePage())
		} catch (e) {
			console.error(e);
		}
	}
  }

  render() {
	return (
	<div className="App">
		<PageHeader username={this.state.username} authenticated={this.state.authenticated}/>
		<div className="App-intro">
		</div>
	</div>
	);
  }
}

export default App;
