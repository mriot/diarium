import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import SeparatorHandle from "./separator-handle";
import MarkdownView from './markdown-view/markdown-view';
import MarkdownEditor from './markdown-editor';
import Toolbar from './toolbar';

const EditorContainer = styled.div `
	width: 100%;
	display: flex;
	max-height: 100%;
	overflow: hidden;
  position: relative;
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
const InnerEditorContainer = styled.div `
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

		this.backup = {
			markdownEditorWidth: "50%",
			scrollSyncPreference: true,
		}

		this.state = {
			markdown: `# Hello World!`,
			editMode: true,
			zenMode: false,
			nodesReady: false,
			renderPreview: true,
			scrollSync: true,
			forceUpdateSeparator: 0,
			scrollSyncPosition: 0,
			editorHistory: {undo: 0, redo: 0},
			markdownEditorWidth: "50%",
		}
	}

	componentDidMount() {
		this.editorContainerNode = ReactDOM.findDOMNode(this.editorContainerRef.current);
		this.editorNode = ReactDOM.findDOMNode(this.markdownEditorRef.current);
		this.previewNode = ReactDOM.findDOMNode(this.markdownViewRef.current);

		// render separator when all node refs are available
		this.setState({nodesReady: true});

		if (this.state.editMode && localStorage.getItem("preview-hidden") === "true") 
			this.hidePreview();

		// always focus editor on 'tab' press
		document.addEventListener("keydown", event => {
      if (event.which === 9) {
				event.preventDefault();
				this.editorFocus();
			}
		});
	}

	showPreview() {
		this.setState({
			renderPreview: true,
			markdownEditorWidth: this.backup.markdownEditorWidth || "50%",
			scrollSync: this.backup.scrollSyncPreference || true,
		});

		this.previewNode.classList.remove("hidden");
		localStorage.setItem("preview-hidden", false);
	}

	hidePreview() {
		this.backup.markdownEditorWidth = this.editorNode.style.width || "50%"; // node is more likely to be up to date than state
		this.backup.scrollSyncPreference = this.state.scrollSync;

		this.setState({
			renderPreview: false,
			markdownEditorWidth: "100%",
			scrollSync: false,
		});

		this.previewNode.classList.add("hidden");
		localStorage.setItem("preview-hidden", true);
	}

	toggleZenMode(force) {
		this.setState({
			zenMode: force === undefined ? !this.state.zenMode : force,
			forceUpdateSeparator: this.state.forceUpdateSeparator + 1,
		})
	}

	toggleScrollSync(force) {
		this.setState({scrollSync: force === undefined ? !this.state.scrollSync : force});
	}

	resetEditorLayout() {
		this.backup = {};

		this.showPreview();
		this.toggleScrollSync(true);
		this.toggleZenMode(false);

		this.editorNode.style.width = "";
		this.previewNode.style.width = "";

		this.setState({forceUpdateSeparator: this.state.forceUpdateSeparator + 1});
	}

	acceptMethods(methods) {
		// method refs  	| shared methods from markdown editor
    this.insertCode 	= methods.insertCode;
    this.insertLink 	= methods.insertLink;
    this.editorUndo 	= methods.editorUndo;
    this.editorRedo 	= methods.editorRedo;
    this.editorFocus 	= methods.editorFocus;
  }

	render() {
		return (
			<EditorContainer ref={this.editorContainerRef} className={this.state.zenMode ? "zen-mode" : ""}>
				<Toolbar 
					// get passed to another child
					editorFocus={() => this.editorFocus()}
					editorUndo={() => this.editorUndo()}
					editorRedo={() => this.editorRedo()}
					insertCode={() => this.insertCode()}
					insertLink={() => this.insertLink()}
					// called directly here
					toggleZenMode={this.toggleZenMode.bind(this)}
					togglePreview={this.state.renderPreview ? this.hidePreview.bind(this) : this.showPreview.bind(this)}
					toggleScrollSync={this.toggleScrollSync.bind(this)}
					resetEditorLayout={this.resetEditorLayout.bind(this)}
					// used to highlight active buttons in toolbar
					toolbarStatus={{
						zenModeActive: this.state.zenMode,
						previewActive: this.state.renderPreview,
						scrollSyncActive: this.state.scrollSync,
						editorHistory: this.state.editorHistory,
					}}
				/>

				<InnerEditorContainer>
					<MarkdownEditor
						ref={this.markdownEditorRef}
						value={this.state.markdown}
						allocWidth={this.state.markdownEditorWidth}
						shareMethods={this.acceptMethods.bind(this)}
						scrollPosChange={scrollSyncPosition => this.setState({scrollSyncPosition})}
						change={markdown => this.setState({markdown})}
						getEditorHistory={editorHistory => this.setState({editorHistory})}
					/>

					{this.state.nodesReady && this.state.renderPreview &&
						<SeparatorHandle
							forceUpdateSeparator={this.state.forceUpdateSeparator}
							containerNode={this.editorContainerNode}
							editorNode={this.editorNode}
							previewNode={this.previewNode}
						/>
					}

					<MarkdownView
						ref={this.markdownViewRef}
						markdown={this.state.markdown}
						scrollSyncPos={this.state.scrollSync && this.state.scrollSyncPosition}
					/>
				</InnerEditorContainer>
			</EditorContainer>			
		);
	}
}
