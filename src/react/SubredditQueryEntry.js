import React, { Component } from "react";
import {Link} from 'react-router-dom';
import Linkify from 'linkifyjs/react';
import Interweave from 'interweave';
import LinkTransform from './InterweaveLinkTransform';

class SubredditQueryEntry extends Component {

    ifIconImg() {
        if (this.props.data.icon_img) {
            return (
                <img className="card-img-top" src={this.props.data.icon_img} alt={this.props.data.name}/>
            )
        }
    }

    render() {
        return (
            <div className="card" onClick={() => this.props.switchMainPage(this.props.data.url.substring(1, this.props.data.url.length - 1) , 'Listing')}>
                {this.ifIconImg()}
                <div className="card-body">
                    <Link to={'/Listing/' + this.props.data.url.substring(1, this.props.data.url.length - 1)}>{this.props.data.url}</Link>
                    <div> Subscribers: {this.props.data.subscribers} </div>
                    <Linkify><Interweave tagName='fragment' transform={LinkTransform} content={this.props.data.public_description_html}/></Linkify>
                </div>
            </div>
        )
    }
}

export default SubredditQueryEntry;