import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from "react-markdown";
import "./theme/ceres.css";

const RenderedMarkdownContainer = styled.div `
	width: 50%;
	padding: 0 5px;
	box-sizing: border-box;
	background-color: #fff;
`

export default class MarkdownView extends React.PureComponent {
	render() {
		return (
			<RenderedMarkdownContainer className="markdown-body">
				<ReactMarkdown source={this.props.markdown} />
			</RenderedMarkdownContainer>
		);
	}
}
