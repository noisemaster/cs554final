import React, { Component } from 'react';

class Listing extends Component {
    render() {

        const ifThumbnail = () => {
            if (this.props.data.thumbnail && this.props.data.thumbnail_height && this.props.data.thumbnail_width
                && this.props.data.thumbnail !== 'self' && this.props.data.thumbnail !== 'default'
                && this.props.data.thumbnail !== 'image' && this.props.data.thumbnail !== 'nsfw' ) {
                return (
                    <div><img src={this.props.data.thumbnail}/></div>
                );
            }
        }

        return (
        <div>
            <div>{this.props.data.subreddit_name_prefixed} Posted By u/{this.props.data.author}</div>
            <div><h2>{this.props.data.title}</h2></div>
            {ifThumbnail()}
        </div>
        );
    }
}

export default Listing;