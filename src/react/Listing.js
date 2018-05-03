import React, { Component } from 'react';
import helper from '../helper';

class Listing extends Component {
    render() {
        const ifThumbnail = () => {
            if (this.props.data.media && this.props.data.media.oembed && this.props.data.media.oembed.thumbnail_url) {
                return (
                    <div><img src={this.props.data.media.oembed.thumbnail_url} alt={this.props.data.media.oembed.description}/></div>
                );
            } 
            if (this.props.data.thumbnail && this.props.data.thumbnail_height && this.props.data.thumbnail_width
                && this.props.data.thumbnail !== 'self' && this.props.data.thumbnail !== 'default'
                && this.props.data.thumbnail !== 'image' && this.props.data.thumbnail !== 'nsfw' ) {
                return (
                    <div><img src={this.props.data.thumbnail} alt={this.props.data.title}/></div>
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
        <div>
            <div><h2 onClick={() => {this.props.switchMainPage(this.props.data.permalink, 'RedditPostDisplay')}}>{this.props.data.title}</h2></div>
            <div>
                <p onClick={() => {this.props.switchMainPage(this.props.data.subreddit_name_prefixed, 'Listing')}}>{this.props.data.subreddit_name_prefixed}</p>
                <p onClick={() => {this.props.switchMainPage(this.props.data.author, 'RedditProfileDisplay')}}>Posted By u/{this.props.data.author}</p>
                 Created {helper.timeDifferenceString(new Date(this.props.data.created_utc * 1000), Date.now())} ago
            </div>
            {ifThumbnail()}
            {ifExternalUrl()}
        </div>
        );
    }
}

export default Listing;