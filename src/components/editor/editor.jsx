import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import SeparatorHandle from "./separator-handle";
import MarkdownView from './markdown-view';
import MarkdownEditor from './markdown-editor';
import Toolbar from './toolbar';

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

export default class Editor extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.editorContainerRef = React.createRef();
		this.markdownViewRef = React.createRef();
		this.markdownEditorRef = React.createRef();

		this.state = {
			markdown: "# Hello World!",
			zenMode: false,
			nodesReady: false,
			renderPreview: true,
			previewWidthBackup: "50%",
			forceUpdateSeparator: 0,
		}
	}

	componentDidMount() {
		this.editorContainerNode = ReactDOM.findDOMNode(this.editorContainerRef.current);
		this.editorNode = ReactDOM.findDOMNode(this.markdownEditorRef.current);
		this.previewNode = ReactDOM.findDOMNode(this.markdownViewRef.current);

		this.editorNode.style.width = "50%";
		this.previewNode.style.width = "50%";
		this.setState({nodesReady: true});

		if (localStorage.getItem("preview-hidden") === "true") this.togglePreview(true);

		// always focus editor on 'tab' press
		document.addEventListener("keydown", event => {
      if (event.which === 9) {
				event.preventDefault();
				this.editorFocus();
			}
    })
	}

	togglePreview(skipStorageUpdate) {
		this.setState({renderPreview: !this.state.renderPreview}, () => {
			if (this.state.renderPreview) {
				this.editorNode.style.width = this.state.previewWidthBackup;
				this.previewNode.classList.remove("hidden");
				!skipStorageUpdate && localStorage.setItem("preview-hidden", false)
			} else {
				this.setState({previewWidthBackup: this.editorNode.style.width});
				this.editorNode.style.width = "100%";
				this.previewNode.classList.add("hidden");
				!skipStorageUpdate && localStorage.setItem("preview-hidden", true)
			}
		})
	}

	toggleZenMode() {
		this.setState({
			zenMode: !this.state.zenMode,
			forceUpdateSeparator: this.state.forceUpdateSeparator + 1,
		})
	}

	resetLayout() {
		this.setState({
			zenMode: false,
			renderPreview: true,
			previewWidthBackup: "50%",
			forceUpdateSeparator: this.state.forceUpdateSeparator + 1,
		})
		this.editorNode.style.width = "50%";
		this.previewNode.style.width = "50%";
		this.previewNode.classList.remove("hidden");
		localStorage.setItem("preview-hidden", false)
	}

	acceptMethods(methods) {
    this.insertCode = methods.insertCode;
    this.insertLink = methods.insertLink;
    this.editorUndo = methods.editorUndo;
    this.editorRedo = methods.editorRedo;
    this.editorFocus = methods.editorFocus;
  }

	render() {
		return (
			<EditorContainer ref={this.editorContainerRef} className={this.state.zenMode ? "zen-mode" : ""}>
				<Toolbar 
					editorFocus={() => this.editorFocus()}
					editorUndo={() => this.editorUndo()}
					editorRedo={() => this.editorRedo()}
					insertCode={() => this.insertCode()}
					insertLink={() => this.insertLink()}
					toggleZenMode={this.toggleZenMode.bind(this)}
					togglePreview={this.togglePreview.bind(this)}
					resetLayout={this.resetLayout.bind(this)}
					toolbarStatus={{
						zenModeActive: this.state.zenMode,
						previewActive: this.state.renderPreview,
					}}
				/>

				<InnerContainer>
					<MarkdownEditor
						shareMethods={this.acceptMethods.bind(this)}
						ref={this.markdownEditorRef}
						value={this.state.markdown}
						change={markdown => {
							this.setState({markdown})
						}}
					/>

					{this.state.nodesReady && this.state.renderPreview &&
						<SeparatorHandle
							forceUpdateSeparator={this.state.forceUpdateSeparator}
							containerNode={this.editorContainerNode}
							editorNode={this.editorNode}
							previewNode={this.previewNode}
						/>
					}

					<MarkdownView markdown={this.state.markdown} ref={this.markdownViewRef} />
				</InnerContainer>
			</EditorContainer>			
		);
	}
}
