import React, { Component } from 'react';

class RedditPost extends Component {
    render() {
        if (!this.props.data) {
            return <div/>
        }

        console.log(this.props);
        const ifSelfText = () => {
            if (this.props.data.selftext) {
                return (
                    <div>{this.props.data.selftext}</div>
                );
            }
        }

        const ifImages = () => {
            if (this.props.data.preview && this.props.data.preview.images && this.props.data.preview.images.length > 0) {
                return (
                    <div>
                        {this.props.data.preview.images.map( (image) => {
						    return <img src={image.resolutions[image.resolutions.length - 1].url}/>
					    })}
                    </div>
                );
            }
        }
        return (
        <div>
            <div>u/{this.props.data.author}</div>
            {ifSelfText()}
            {ifImages()}
        </div>
        );
    }
}

export default RedditPost;