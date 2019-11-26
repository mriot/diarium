import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import SeparatorHandle from "./separator-handle";
import CodeMirror from "react-codemirror";
import MarkdownView from './markdown-view';
import "codemirror/lib/codemirror.css";
import "./theme/lucario2.css";
import "codemirror/mode/markdown/markdown";
import Toolbar from './toolbar';

const ViewContainer = styled.div `

`
const EditorContainer = styled.div `
	width: 100%;
  position: relative;
	display: flex;
	flex-direction: column;
`
const InnerContainer = styled.div `
  position: relative;
	display: flex;
	width: 100%;
	height: 100%;
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

		this.editorConfig = {
			mode: "markdown",
			lineNumbers: true,
			theme: "lucario"
		}

		this.state = {
			markdown: "# Hello World!",
			viewMode: false,
			nodesReady: false,
		}
	}

	componentDidMount() {
		this.markdownContainer = ReactDOM.findDOMNode(this.editorContainer.current);
		this.editorNode = ReactDOM.findDOMNode(this.markdownEditor.current);
		this.viewNode = ReactDOM.findDOMNode(this.markdownView.current);
		this.setState({nodesReady: true})
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
						<Toolbar />
						<InnerContainer>
							<StyledCodeMirror
								ref={this.markdownEditor}
								value={this.state.markdown}
								onChange={markdown => {
									this.setState({markdown})
								}}
								options={this.editorConfig}
							/>

							{this.state.nodesReady &&
								<SeparatorHandle
									containerNode={this.markdownContainer}
									editorNode={this.editorNode}
									viewNode={this.viewNode}
								/>
							}

							<MarkdownView markdown={this.state.markdown} ref={this.markdownView} />
						</InnerContainer>
					</EditorContainer>
				}
			</>
		);
	}
}
