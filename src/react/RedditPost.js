import React, { Component } from 'react';
import Linkify from 'linkifyjs/react';
import helper from '../helper';
import {Link} from 'react-router-dom';
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
                    <a href={this.props.data.url}>{this.props.data.url}</a>
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
                    <ReactPlayer width="100%" height="100%" url={this.props.data.media.reddit_video.fallback_url} playing controls={true}/>
                );
            }
            if (this.props.data.media && this.props.data.media.oembed && this.props.data.media.oembed.thumbnail_url) {
                return (
                    <img className="card-img-bottom" xl src={this.props.data.media.oembed.thumbnail_url} alt={this.props.data.media.oembed.description}/>
                );
            }
            if (this.props.data.preview && this.props.data.preview.reddit_video_preview && this.props.data.preview.reddit_video_preview.fallback_url) {
                return (
                    <ReactPlayer width="100%" height="100%" url={this.props.data.preview.reddit_video_preview.fallback_url} playing controls={true}/>
                );
            }
            if (this.props.data.preview && this.props.data.preview.images && this.props.data.preview.images.length > 0) {
                return (
                    <div>
                        {this.props.data.preview.images.map( (image) => {
                            if (image.resolutions && image.resolutions.length && image.resolutions[image.resolutions.length - 1]) {
                                return <img className="card-img-bottom" src={image.resolutions[image.resolutions.length - 1].url} alt={this.props.data.title} key={image.id}/>
                            }
					    })}
                    </div>
                );
            }
        }
        return (
            <div className="card w-100 mb-4 mt-4">
                    <header className="card-header text-center">
                        {this.props.profile ? 
                            <h2><Link to={'/RedditPostDisplay/' + this.props.data.permalink}>{this.props.data.title}</Link></h2> :
                            <h2>{this.props.data.title}</h2>
                        }
                        <p>
                            Posted by <Link to={'/RedditProfileDisplay/' +  this.props.data.author}>u/{this.props.data.author}</Link> in <Link to={'/Listing/' +  this.props.data.subreddit_name_prefixed}>{this.props.data.subreddit_name_prefixed}</Link> with {this.props.data.score} points
                        </p>
                    </header>
                {ifMedia()}
                <div className="card-body">
                    {ifExternalLink()}
                    {ifSelfText()}
                </div>
                <div className="card-footer text-muted">
                    Posted {helper.timeDifferenceString(new Date(this.props.data.created_utc * 1000), Date.now())} ago
                </div>
            </div>
        );
    }
}

export default RedditPost;