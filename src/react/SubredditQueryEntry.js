import React, { Component } from "react";
import Linkify from 'linkifyjs/react';
import Interweave from 'interweave';
import LinkTransform from './InterweaveLinkTransform';

class SubredditQueryEntry extends Component {

    ifIconImg() {
        if (this.props.data.icon_img) {
            return (
                <div><img src={this.props.data.icon_img} alt={this.props.data.name}/></div>
            )
        }
    }

    render() {
        return (
            <div onClick={() => this.props.switchMainPage('r/' + this.props.data.title , 'Listing')}>
                {this.ifIconImg()}
                <div> {this.props.data.url} </div>
                <div> Subscribers: {this.props.data.subscribers} </div>
                <Linkify><Interweave tagName='fragment' transform={LinkTransform} content={this.props.data.public_description_html}/></Linkify>
            </div>
        )
    }
}

export default SubredditQueryEntry;