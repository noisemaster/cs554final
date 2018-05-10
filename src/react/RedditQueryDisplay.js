import React, { Component } from "react";
import redditApi from './utility/redditApi';
import SubredditQueryEntry from './SubredditQueryEntry';
import DocumentTitle from "react-document-title";
import Listing from './Listing';

class RedditQueryList extends Component {
    constructor (props) {
        super (props);
        this.state = {
            queryArray: [],
            type: 'Subreddits',
            after: undefined
        }
    }

    resetQuery = async (props) => {
        if (!this.props.match.params['0']) {
            return;
        }
        if (this.state.type === 'Subreddits') {
            let response = await redditApi.genericGetRequest('search?q=' + this.props.match.params['0'] + '&type=sr,user&raw_json=1');
            if (response.data && response.data.children) {
                this.setState({
                    queryArray: response.data.children,
                    after: response.data.after
                });
            }
        } else {
            let response = await redditApi.genericGetRequest('search?q=' + this.props.match.params['0'] + '&type=link&raw_json=1');
            if (response.data && response.data.children) {
                this.setState({
                    queryArray: response.data.children,
                    after: response.data.after
                });
            }
        }
    }

    componentDidMount = this.resetQuery;

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params['0'] !== this.props.match.params['0']) {
            this.resetQuery();
            return;
        }
        if (this.state.type !== prevState.type) {
            this.resetQuery();
            return;
        }
    }

	setType = (newType) => {
		this.setState (
			{
				type: newType,
				queryArray: []
			}
		)
	};

	isTypeActive = type => {
		if (this.state.type === type) {
			return 'btn btn-primary ml-1';
		}
		return 'btn btn-outline-primary ml-1';
    }
    
    returnProperHTML = () => {
        if (this.state.queryArray.filter(entry => entry.kind === 't5').length !== 0) {
            return (
                <div className="card-columns">
                    {this.state.queryArray.map(entry => {
                        return (
                            <SubredditQueryEntry data={entry.data} key={entry.data.id} switchMainPage={this.props.switchMainPage}/>
                        )
                    })}
                </div>
            )
        }
        return this.state.queryArray.map(entry => {
            return <Listing data={entry.data} key={entry.data.id} switchMainPage={this.props.switchMainPage}/>
        })
    }

	getNextListingList = async () => {
        if (this.state.type === 'Subreddits') {
            let response = await redditApi.genericGetRequest('search?q=' + this.props.match.params['0'] + '&type=sr,user&raw_json=1&after=' + this.state.after);
            if (response.data && response.data.children) {
                this.setState({
                    queryArray: this.state.queryArray.concat(response.data.children),
                    after: response.data.after
                });
            }
        } else {
            let response = await redditApi.genericGetRequest('search?q=' + this.props.match.params['0'] + '&type=link&raw_json=1&after=' + this.state.after);
            if (response.data && response.data.children) {
                this.setState({
                    queryArray: this.state.queryArray.concat(response.data.children),
                    after: response.data.after
                });
            }
        }
	}

	render() {
		return (
			<DocumentTitle title={`Search for ${this.props.match.params['0']} ${this.state.type} - Viewit`}>
				<main className="container">
                    <div className="navbar navbar-expand-lg navbar-light justify-content-md-center">
                        <div className="navbar-nav">
                            <button type="button" className={this.isTypeActive('Subreddits')} onClick={() => this.setType('Subreddits')}> Subreddits </button>
                            <button type="button" className={this.isTypeActive('Posts')} onClick={() => this.setType('Posts')}> Posts </button>
                        </div>
                    </div>
                    {this.returnProperHTML()}
					<div onClick={this.getNextListingList}> Get More Results </div>
				</main>
			</DocumentTitle>
		);
	}
}

export default RedditQueryList;