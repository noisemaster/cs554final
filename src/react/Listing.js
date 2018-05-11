import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import helper from '../helper';

class Listing extends Component {
    render() {
        const ifThumbnail = () => {
            if (this.props.data.media && this.props.data.media.oembed && this.props.data.media.oembed.thumbnail_url) {
                return (
                    <img className="mr-3 align-self-center thumbnail" src={this.props.data.media.oembed.thumbnail_url} alt={this.props.data.title}/>
                );
            } 
            if (this.props.data.thumbnail && this.props.data.thumbnail_height && this.props.data.thumbnail_width
                && this.props.data.thumbnail !== 'self' && this.props.data.thumbnail !== 'default'
                && this.props.data.thumbnail !== 'image' && this.props.data.thumbnail !== 'nsfw' ) {
                return (
                    <img className="mr-3 align-self-center thumbnail" src={this.props.data.thumbnail} alt={this.props.data.title}/>
                );
            }
        }

        const ifExternalUrl = () => {
            if (this.props.data.url) {
                return (
                    <div><a href={this.props.data.url}>{this.props.data.url}</a></div>
                )
            }
        }

        return (
            <div className="media mb-3">
                {ifThumbnail()}
                <div className="media-body">
                    <Link to={'/RedditPostDisplay/' + this.props.data.permalink.substring(1)}>{this.props.data.title}</Link>
                    {ifExternalUrl()}
                    <Link to={'/Listing/' + this.props.data.subreddit_name_prefixed}>{this.props.data.subreddit_name_prefixed}</Link>
                    <p className="mb-0">Posted By <Link to={"/RedditProfileDisplay/" + this.props.data.author}>u/{this.props.data.author}</Link></p>
                    <p className="mb-0">Created {helper.timeDifferenceString(new Date(this.props.data.created_utc * 1000), Date.now())} ago</p>
                </div>
            </div>
        );
    }
}

export default Listing;