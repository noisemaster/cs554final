import React, { Component } from "react";

class SubredditQueryEntry extends Component {

    ifIconImg() {
        if (this.props.data.icon_img) {
            return (
                <div><img src={this.props.data.icon_img}/></div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.ifIconImg()}
                <div> {this.props.data.name} </div>
                <div> Active Users: {this.props.data.active_user_count} Subscribers: {this.props.data.subscriber_count} </div>
            </div>
        )
    }
}

export default SubredditQueryEntry;