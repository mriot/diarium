import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Editor from 'for-editor'
import ReactMarkdown from "react-markdown";
import SeparatorHandle from "./separator-handle";
import CodeMirror from "react-codemirror";
import MarkdownView from './markdown-view';
import "codemirror/lib/codemirror.css";
import "./theme/lucario2.css";
import "codemirror/mode/markdown/markdown";

const ViewContainer = styled.div `

`
const EditorContainer = styled.div `
	width: 100%;
  position: relative;
	background-color: #fff;
	display: flex;
`
const StyledCodeMirror = styled(CodeMirror) `
	width: 50%;
	height: 100%;
`

export default class MarkdownEditor extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.editorContainer = React.createRef();
		this.markdownView = React.createRef();
		this.markdownEditor = React.createRef();

		this.state = {
			markdown: "# Hello World!",
			viewMode: false,
			ready: false,
		}
	}

	componentDidMount() {
		this.markdownContainer = ReactDOM.findDOMNode(this.editorContainer.current);
		this.editorNode = ReactDOM.findDOMNode(this.markdownEditor.current);
		this.viewNode = ReactDOM.findDOMNode(this.markdownView.current);
		console.log(this.markdownContainer);
		this.setState({ready: true})
	}

	render() {
		return (
			<>
				{this.state.viewMode &&
					<ViewContainer>
						{this.state.markdown}
					</ViewContainer>
				}
				{!this.state.viewMode &&
					<EditorContainer ref={this.editorContainer}>
						<StyledCodeMirror ref={this.markdownEditor} value={this.state.markdown} onChange={(markdown, ...args) => {
							// console.log(markdown, ...args);
							this.setState({markdown})
						}} options={{
							mode: "markdown",
							lineNumbers: true,
							theme: "lucario"
						}} />

						{this.state.ready &&
							<SeparatorHandle
								containerNode={this.markdownContainer}
								editorNode={this.editorNode}
								viewNode={this.viewNode}
							/>
						}

						<MarkdownView markdown={this.state.markdown} ref={this.markdownView} />
					</EditorContainer>
				}
			</>
		);
	}
}
