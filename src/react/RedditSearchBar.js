import React, { Component } from "react";

class RedditSearchBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			subredditQuery: ''
		};
	}

	onSubmit = e => {
		e.preventDefault();
		if (this.state.subredditQuery) {
			this.props.switchMainPage(this.state.subredditQuery, 'RedditQueryDisplay');
		}
		this.setState({
			subredditQuery: ''
		});
	};

	onSubredditQueryChange = e => {
		this.setState({
			subredditQuery: e.target.value
		});
	};

	render() {
		return (
			<form className="form-inline my-2 my-lg-0" id="subredditSearchForm" onSubmit={this.onSubmit}>
				<label className="sr-only" for="subredditSearch">Search</label>
				<input
					type="text"
					value={this.state.subredditQuery}
					onChange={this.onSubredditQueryChange}
					maxLength="50"
					className="form-control mr-sm-2"
					id="subredditSearch"
					placeholder="Search for Subreddit..."
				/>
			</form>
		);
	}
}

export default RedditSearchBar;