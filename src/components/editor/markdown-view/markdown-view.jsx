import React from 'react';
import ReactDOM from "react-dom";
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReactMarkdown from "react-markdown";
import "./theme/ceres.css";
import "./theme/vesta.css";

const RenderedMarkdownContainer = styled.div `
	width: 50%;
	padding: 0 5px;
	box-sizing: border-box;

	${props => props.isReadModeActive && `
		width: 100% !important;
	`}
	
	/* toggled in Editor -> showPreview() and hidePreview() */
	&.hidden {
		width: 0 !important;
		padding: 0;
	}
`

export default class MarkdownView extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.markdownOutputRef = React.createRef();
	}
	
	componentDidMount() {
		this.markdownOutputNode = ReactDOM.findDOMNode(this.markdownOutputRef.current);
		this.markdownOutputNode.scrollTop = this.props.scrollSyncPos;
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.isScrollSyncActive)
			this.markdownOutputNode.scrollTop = this.props.scrollSyncPos;
	}
	
	render() {
		return (
			<RenderedMarkdownContainer
				ref={this.markdownOutputRef}
				className="markdown-body"
				isReadModeActive={this.props.isReadModeActive}	
			>
				<ReactMarkdown source={this.props.markdown} />
			</RenderedMarkdownContainer>
		);
	}
}

MarkdownView.propTypes = {
	markdown: PropTypes.string,
	scrollSyncPos: PropTypes.number,
	isReadModeActive: PropTypes.bool,
	isScrollSyncActive: PropTypes.bool,
}
