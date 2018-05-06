import React, { Component } from 'react';
import Linkify from 'linkifyjs/react';
import helper from '../helper';
import Interweave from 'interweave';
import LinkTransform from './InterweaveLinkTransform';
import ReactPlayer from 'react-player';

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
                    <Linkify><Interweave tagName='fragment' transform={LinkTransform} content={this.props.data.selftext_html}/></Linkify>
                );
            }
        }

        const ifMedia = () => {
            if (this.props.data.media && this.props.data.media.reddit_video && this.props.data.media.reddit_video.dash_url) {
                return (
                    <ReactPlayer url={this.props.data.media.reddit_video.fallback_url} playing controls={true}/>
                );
            }
            if (this.props.data.media && this.props.data.media.oembed && this.props.data.media.oembed.thumbnail_url) {
                return (
                    <img className="card-img-bottom" xl src={this.props.data.media.oembed.thumbnail_url} alt={this.props.data.media.oembed.description}/>
                );
            }
            if (this.props.data.preview && this.props.data.preview.reddit_video_preview && this.props.data.preview.reddit_video_preview.fallback_url) {
                return (
                    <ReactPlayer url={this.props.data.preview.reddit_video_preview.fallback_url} playing controls={true}/>
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
        <div className="card">
            <div className="card-body">
                <h2 onClick={() => {this.props.switchMainPage(this.props.data.permalink, 'RedditPostDisplay')}}>{this.props.data.title}</h2>
                <div onClick={() => {this.props.switchMainPage(this.props.data.subreddit_name_prefixed, 'Listing')}}>{this.props.data.subreddit_name_prefixed}</div>
                <div onClick={() => {this.props.switchMainPage(this.props.data.author, 'RedditProfileDisplay')}}>u/{this.props.data.author}</div>
                <div> Score: {this.props.data.score} </div>
                <div> Posted {helper.timeDifferenceString(new Date(this.props.data.created_utc * 1000), Date.now())} ago </div>
                {ifExternalLink()}
                {ifSelfText()}
            </div>
            {ifMedia()}
        </div>
        );
    }
}

export default RedditPost;