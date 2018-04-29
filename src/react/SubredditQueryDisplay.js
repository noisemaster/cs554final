import React, { Component } from "react";
import redditApi from './utility/redditApi';
import SubredditQueryEntry from './SubredditQueryEntry';

class SubredditQueryList extends Component {
    constructor (props) {
        super (props);
        this.state = {
            queryArray: []
        }
    }

    resetQuery = async (props) => {
        console.log('Am I doing this again');
        if (!this.props.data) {
            return;
        }
        const response = await redditApi.genericPostRequest('api/search_subreddits?query=' + this.props.data, null);
        console.log(response.subreddits);
        if (response.subreddits) {
            this.setState({
                queryArray: response.subreddits
            });
        }
    }

    componentDidMount = this.resetQuery;
    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            this.resetQuery();
        }
    }

    render() {
        return (
            <div>
                <div> Results for: {this.props.data} </div>
                <div>
					{this.state.queryArray.map( (result) => {
						return <SubredditQueryEntry data={result} key={result.name} switchMainPage={this.props.switchMainPage}/>
					})}
				</div>
            </div>
        );
    }
}

export default SubredditQueryList;