import React, { Component } from 'react';
import Linkify from 'linkifyjs/react';
import helper from '../helper';

class RedditPost extends Component {
    render() {
        if (!this.props.data) {
            return <div/>
        }

        const ifExternalLink = () => {
            if (this.props.data.url) {
                return (
                    <div><a href={this.props.data.url}>{this.props.data.url}</a></div>
                );
            }
        }

        const ifSelfText = () => {
            if (this.props.data.selftext) {
                return (
                    <div><Linkify>{this.props.data.selftext}</Linkify></div>
                );
            }
        }

        const ifImages = () => {
            if (this.props.data.media && this.props.data.media.oembed && this.props.data.media.oembed.thumbnail_url) {
                return (
                    <div><img src={this.props.data.media.oembed.thumbnail_url} alt={this.props.data.media.oembed.description}/></div>
                );
            } 
            if (this.props.data.preview && this.props.data.preview.images && this.props.data.preview.images.length > 0) {
                return (
                    <div>
                        {this.props.data.preview.images.map( (image) => {
						    return <img src={image.resolutions[image.resolutions.length - 1].url} alt={this.props.data.title} key={image.id}/>
					    })}
                    </div>
                );
            }
        }
        return (
        <div>
            <h2 onClick={() => {this.props.switchMainPage(this.props.data.permalink, 'RedditPostDisplay')}}>{this.props.data.title}</h2>
            <div onClick={() => {this.props.switchMainPage(this.props.data.subreddit_name_prefixed, 'Listing')}}>{this.props.data.subreddit_name_prefixed}</div>
            <div onClick={() => {this.props.switchMainPage(this.props.data.author, 'RedditProfileDisplay')}}>u/{this.props.data.author}</div>
            <div> Posted {helper.timeDifferenceString(new Date(this.props.data.created_utc * 1000), Date.now())} ago </div>
            {ifExternalLink()}
            {ifSelfText()}
            {ifImages()}
        </div>
        );
    }
}

export default RedditPost;