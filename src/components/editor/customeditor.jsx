import React from 'react';
import styled from 'styled-components';
import Preview from './preview';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
// a11yDark, agate, anOldHope, atomOneDark, dracula, tomorrowNight, githubGist
import { tomorrowNight as markdownTheme } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Editor from 'for-editor'

const StyledEditor = styled.div `
	width: 100%;
  position: relative;
	background-color: #555;
	display: flex;
`
const Markdown = styled(ReactMarkdown) `
	flex: 1;
	background-color: #333;
`
const TextEditor = styled.textarea `
	flex: 1;
	height: 100%;
	outline: none;
	border: none;
	resize: none;
	padding: 0;
	margin: 0;
	background: none;
	color: #fff;
	font-size: 16px;
	font-family: sans-serif;
`
const SeparatorHandle = styled.div `
	position: absolute;
	left: 50%;
	height: 100%;
	width: 7px;
	background-color: #777;
	cursor: col-resize;
`

export default class CustomEditor extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.state = {
			markdown: "# Hello World!"
		}
	}

	render() {
		console.log(this.state.markdown)
		return (
			<StyledEditor>
				<Editor
					style={{
						"width": "100%",
						"height": "100%"
					}}
					language={"en"}
					subfield={true}
					preview={true}
					value={this.state.markdown}
					onChange={value => this.setState({markdown: value})}
				/>
				{/* <ToolBar /> */}
				{/* <TextEditor onChange={event => this.setState({markdown: event.target.value})}></TextEditor> */}
				{/* <SeparatorHandle /> */}
				{/* <Markdown source={this.state.markdown} className="markdown-container" />
				<SyntaxHighlighter language="javascript" style={markdownTheme}>
					{this.state.markdown}
				</SyntaxHighlighter> */}
				{/* <Preview markdown={this.state.markdown} /> */}
			</StyledEditor>
		);
	}
}
