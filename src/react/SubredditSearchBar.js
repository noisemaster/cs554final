import React, { Component } from "react";

class SubredditSearchBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			subredditQuery: ''
		};
	}

	onSubmit = e => {
		e.preventDefault();
		if (this.state.subredditQuery) {
			this.props.switchMainPage(this.state.subredditQuery, 'SubredditQueryDisplay');
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
			<form id="subredditSearchForm" onSubmit={this.onSubmit}>
				<div className="form-group">
					<input
						type="text"
						value={this.state.subredditQuery}
                        onChange={this.onSubredditQueryChange}
                        maxLength="50"
						className="form-control"
						id="subredditSearch"
						placeholder="Search for Subreddit..."
					/>
				</div>
			</form>
		);
	}
}

export default SubredditSearchBar;