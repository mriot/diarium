import React from 'react';
import ReactDOM from "react-dom";
import styled from 'styled-components';
import ReactMarkdown from "react-markdown";
import "./theme/ceres.css";

const RenderedMarkdownContainer = styled.div `
	width: 50%;
	padding: 0 5px;
	box-sizing: border-box;
	background-color: #fff;

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
		this.markdownOutputNode.scrollTop = this.props.scrollSyncPos;
	}
	
	render() {
		return (
			<RenderedMarkdownContainer ref={this.markdownOutputRef} className="markdown-body">
				<ReactMarkdown source={this.props.markdown} />
			</RenderedMarkdownContainer>
		);
	}
}
