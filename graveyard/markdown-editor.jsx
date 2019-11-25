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
	outline: none;
	border: none;
	resize: none;
	padding: 0;
	margin: 0;
	background: none;
	color: #fff;
	font-size: 16px;
	tab-size: 2;
	font-family: 'Consolas', 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
	box-sizing: border-box;
	padding: 8px 0;
	display: block;
	height: 100%;
	width: 100%;
	overflow: hidden;
	line-height: inherit;
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
			markdown: "# Hello World!",
			editorView: false,
		}
	}

	render() {
		return (
			<StyledEditor>
				<button onClick={() => this.setState({editorView: !this.state.editorView})}>Toggle</button>
				{this.state.editorView && 
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
				}
				
				{/* 
					<TextEditor 
						onChange={event => this.setState({markdown: event.target.value})}
						onKeyDown={event => {
							if (event.which === 9) {
								event.preventDefault();

								const textarea = event.currentTarget;
								const beforeCaret = textarea.selectionStart;
								const afterCaret = textarea.selectionEnd;

								// set textarea value to: text before caret + tab + text after caret
								textarea.value = textarea.value.substring(0, beforeCaret) + "\t" + textarea.value.substring(afterCaret);
								// put caret at right position again
								textarea.selectionStart = textarea.selectionEnd = beforeCaret + 1;
							}
						}}
					/>

					<Markdown source={this.state.markdown} className="markdown-container" />
				*/}
			</StyledEditor>
		);
	}
}
