import React, { Component } from 'react';
import localApi from './utility/localApi';

class AddEmail extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			responseMessage: '',
			color: this.props.color === null ? '#fefefe' : this.props.color
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

	onColorSubmit = async e => {
		e.preventDefault();
		if (this.state.color) {
			try {
				await localApi.setColorChoice(this.state.color);
				this.props.setColor(this.state.color);
				console.log("do I even?");
				this.setState({
					responseMessage: 'Successfully Registered Color'
				});
			} catch (e) {
				console.log(e);
				this.setState({
					responseMessage: 'Failed to Register Color'
				});
			}
		}
	}

	onEmailChange = e => {
		this.setState({
			email: e.target.value
		});
	};

	onColorChange = e => {
		this.setState({
			color: e.target.value
		})
	}

	displayIfEmail = () => {
		if (this.props.email) {
			return (<div> Current Registered Email: {this.props.email}</div>);
		}
	}

	render() {
		return (
			<div className="container">
				<h2> Enter an Email to Register... </h2>
				{this.displayIfEmail()}
				<form className="form-inline my-2 my-lg-0" id="subredditEmailForm" onSubmit={this.onSubmit}>
					<label className="sr-only" style={{color: '#898b8d'}} htmlFor="emailRegistration">Email</label>
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
				<form className="form-inline my-2 my-lg-0" id="subredditColorForm" onSubmit={this.onColorSubmit}>
					<label htmlFor="colorWell">Color:</label>
					<input
						type="color"
						value={this.state.color}
						onChange={this.onColorChange}
						id="colorWell"
					/>
					<button type="submit" className="btn btn-success">Submit</button>
				</form>
				<p>{this.state.responseMessage}</p>
			</div>
		);
	}  
}

export default AddEmail;