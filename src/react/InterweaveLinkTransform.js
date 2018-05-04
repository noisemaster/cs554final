import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const transformLink = (node) => {
	if (node.tagName === 'A') {
		let path = node.getAttribute('href');
		if (path.match('^/u/')) {
			return <Link {...node.attributes} to={'/RedditProfileDisplay/' + path.split('/').slice(-1)}>{node.innerHTML}</Link>;
		} 
		if (path.match('^/r/')) {
			return <Link {...node.attributes} to={'/Listing/' + path}>{node.innerHTML}</Link>;
		}
	}
}

export default transformLink;