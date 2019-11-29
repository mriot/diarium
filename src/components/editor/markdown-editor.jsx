import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import SeparatorHandle from "./separator-handle";
import CodeMirror from "react-codemirror";
import MarkdownView from './markdown-view';
import "codemirror/lib/codemirror.css";
import "code-mirror-themes/themes/clouds-midnight.css"
import "codemirror/mode/markdown/markdown";
import Toolbar from './toolbar';

const ViewContainer = styled.div `

`
const EditorContainer = styled.div `
	width: 100%;
	overflow: hidden;
  position: relative;
	display: flex;
	flex-direction: column;

	&.zen-mode {
		position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
		z-index: 1;
	}
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

	& .CodeMirror {
		height: 100%;
	}
`

export default class MarkdownEditor extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.editorContainer = React.createRef();
		this.markdownView = React.createRef();
		this.markdownEditor = React.createRef();

		this.CodeMirrorInstance = null;

		this.editorConfig = {
			mode: "markdown",
			lineNumbers: true,
			theme: "clouds-midnight",
			tabSize: 2,
			lineWrapping: true,
			fixedGutter: true,
			showCursorWhenSelecting: true,
			autofocus: true,
			// custom prop
			widthBackup: "50%"
		}

		this.state = {
			markdown: "# Hello World!",
			viewMode: false,
			zenMode: false,
			nodesReady: false,
			renderSeparator: true,
		}
	}

	componentDidMount() {
		this.markdownContainer = ReactDOM.findDOMNode(this.editorContainer.current);
		this.editorNode = ReactDOM.findDOMNode(this.markdownEditor.current);
		this.viewNode = ReactDOM.findDOMNode(this.markdownView.current);

		this.CodeMirrorInstance = this.markdownEditor.current.getCodeMirror();
		this.CodeMirrorInstance.execCommand("goDocEnd");

		this.editorNode.style.width = "50%";
		this.viewNode.style.width = "50%";

		this.setState({nodesReady: true});
	}

	togglePreview(status = !this.state.renderSeparator) {
		this.setState({renderSeparator: status})
		if (status) {
			this.editorNode.style.width = this.editorConfig.widthBackup;
			this.viewNode.classList.remove("hidden");
		} else {
			this.editorConfig.widthBackup = this.editorNode.style.width;
			this.editorNode.style.width = "100%";
			this.viewNode.classList.add("hidden");
		}
	}

	toggleZenMode() {
		this.setState({zenMode: !this.state.zenMode}, () => 
			this.state.zenMode && this.togglePreview(false)
		)
		this.CodeMirrorInstance.focus()
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
					<EditorContainer ref={this.editorContainer} className={this.state.zenMode ? "zen-mode" : ""}>
						<Toolbar 
							editorState={this.state}
							toggleZenMode={this.toggleZenMode.bind(this)}
							togglePreview={this.togglePreview.bind(this)}
						/>
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
									hidden={!this.state.renderSeparator}
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
