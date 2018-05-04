import React, { Component } from 'react';
import localRequests from './utility/localApi';
import localApi from './utility/localApi';

class AddEmail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			responseMessage: ''
		};
	}

	onSubmit = async (e) => {
		e.preventDefault();
		if (this.state.email) {
			try {
				await localApi.setEmail(this.state.email);
				this.props.setEmail(this.state.email);
				console.log("do I even?");
				this.setState({
					responseMessage: 'Successfully Registered Email'
				});
			} catch (e) {
				console.log(e);
				this.setState({
					responseMessage: 'Failed to Register Email'
				});
			}
		}
		this.setState({
			email: ''
		});
	};

	onEmailChange = e => {
		this.setState({
			email: e.target.value
		});
	};

	displayIfEmail = () => {
		if (this.props.email) {
			return (<div> Current Registered Email: {this.props.email}</div>);
		}
	}

	render() {
		return (
			<div>
				<h2> Enter an Email to Register... </h2>
				{this.displayIfEmail()}
				<form className="form-inline my-2 my-lg-0" id="subredditSearchForm" onSubmit={this.onSubmit}>
					<input
						type="text"
						value={this.state.email}
						onChange={this.onEmailChange}
						maxLength="50"
						className="form-control mr-sm-2"
						id="emailRegistration"
						placeholder="Enter Email to Register..."
					/>
				</form>
				<p>{this.state.responseMessage}</p>
			</div>
		);
	}  
}

export default AddEmail;