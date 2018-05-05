import React, { Component } from "react";
import redditApi from './utility/redditApi';
import SubredditQueryEntry from './SubredditQueryEntry';
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
			return 'nav-item nav-link active';
		}
		return 'nav-item nav-link';
    }
    
    returnProperHTML = (entry) => {
        if (entry.kind === 't3') {
            return <Listing data={entry.data} key={entry.data.id} switchMainPage={this.props.switchMainPage}/>
        }
        if (entry.kind === 't5') {
            return <SubredditQueryEntry data={entry.data} key={entry.data.id} switchMainPage={this.props.switchMainPage}/>
        }
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
			<div>
				<div className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
					<div className="navbar-nav">
						<a href="#" className={this.isTypeActive('Subreddits')} onClick={() => this.setType('Subreddits')}> Subreddits </a>
						<a href="#" className={this.isTypeActive('Posts')} onClick={() => this.setType('Posts')}> Posts </a>
					</div>
				</div>
				<main className="container">
					{this.state.queryArray.map( (entry) => {
						return this.returnProperHTML(entry)
					})}
					<div onClick={this.getNextListingList}> Get More Results </div>
				</main>
			</div>
		);
	}
}

export default RedditQueryList;