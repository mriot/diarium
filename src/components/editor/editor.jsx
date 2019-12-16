import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import SeparatorHandle from "./separator-handle";
import MarkdownView from './markdown-view/markdown-view';
import MarkdownEditor from './markdown-editor';
import Toolbar from './toolbar';
import posed from 'react-pose';

const editorAnimation = {
	visible: {
		opacity: 1,
		scaleX: 1,
		applyAtStart: {display: "flex"},
		transition: {
			delay: 700,
			duration: 1000,
			ease: "anticipate",
		},
	},

	hidden: {
		opacity: 0,
		scaleX: 0,
		applyAtEnd: {display: "none"},
		transition: {
			duration: 1000,
			ease: "anticipate",
		}
	},
}

const PosedEditorContainer = posed.div(editorAnimation);
const EditorContainer = styled(PosedEditorContainer) `
	display: flex;
	width: 100%;
	height: 100%;
	flex-shrink: 1;
	overflow: hidden;
  position: relative;
	flex-direction: column;
	transform-origin: right;

	${props => props.isZenModeActive && `
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
	`}
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

		this.backup = {
			scrollSyncPreference: true,
		}

		this.state = {
			markdown: `# Hello World!`,
			readMode: this.props.isReadModeActive,
			zenMode: false,
			nodesReady: false,
			preview: true,
			scrollSync: true,
			forceUpdateSeparator: 0,
			scrollSyncPosition: 0,
			editorHistory: {undo: 0, redo: 0},
		}
	}

	componentDidMount() {
		if (!this.state.readMode && localStorage.getItem("preview-hidden") === "true") 
			this.hidePreview();
		
		// collects DOM nodes
		this.setUpSeparator();

		// always focus editor on 'tab' press
		document.addEventListener("keydown", event => {
      if (event.which === 9) {
				event.preventDefault();
				this.editorFocus();
			}
		});
	}

	componentDidUpdate(prevProps, prevState) {
		this.setUpSeparator();

		if (prevProps.readMode !== this.props.isReadModeActive) {
			this.setState({
				readMode: this.props.isReadModeActive
			})
		}
	}

	setUpSeparator() {
		if (!this.state.nodesReady) {
			this.editorContainerNode = ReactDOM.findDOMNode(this.editorContainerRef.current);
			this.previewNode = ReactDOM.findDOMNode(this.markdownViewRef.current);
			// render separator when all node refs are available
			if (this.editorContainerNode && this.previewNode)
				this.setState({nodesReady: true});
		}
	}

	showPreview() {
		this.setState({
			preview: true,
			scrollSync: this.backup.scrollSyncPreference || true,
		});

		this.previewNode.classList.remove("hidden");
		localStorage.setItem("preview-hidden", false);
	}

	hidePreview() {
		this.backup.scrollSyncPreference = this.state.scrollSync;

		this.setState({
			preview: false,
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

		this.previewNode.style.width = "";

		this.setState({forceUpdateSeparator: this.state.forceUpdateSeparator + 1});
	}

	render() {
		return (
			<EditorContainer
				ref={this.editorContainerRef}
				isZenModeActive={this.state.zenMode}
				pose={this.props.pose}
			>
				<Toolbar 
					// call markdown-editor methods
					editorFocus={() => this.markdownEditorRef.editorFocus()}
					editorUndo={() => this.markdownEditorRef.editorUndo()}
					editorRedo={() => this.markdownEditorRef.editorRedo()}
					insertCode={() => this.markdownEditorRef.insertCode()}
					insertLink={() => this.markdownEditorRef.insertLink()}
					// called directly here
					toggleZenMode={this.toggleZenMode.bind(this)}
					togglePreview={this.state.preview ? this.hidePreview.bind(this) : this.showPreview.bind(this)}
					toggleScrollSync={this.toggleScrollSync.bind(this)}
					resetEditorLayout={this.resetEditorLayout.bind(this)}
					// provides everything the Toolbar needs to know
					toolbarStatus={{
						readModeActive: this.state.readMode,
						zenModeActive: this.state.zenMode,
						previewActive: this.state.preview,
						scrollSyncActive: this.state.scrollSync,
						editorHistory: this.state.editorHistory, // for redo/undo buttons
					}}
				/>

				<InnerEditorContainer>
					{!this.state.readMode && 
						<MarkdownEditor
							ref={ref => this.markdownEditorRef = ref}
							value={this.state.markdown}
							scrollPosChange={scrollSyncPosition => this.setState({scrollSyncPosition})}
							change={markdown => this.setState({markdown})}
							getEditorHistory={editorHistory => this.setState({editorHistory})}
						/>
					}

					{!this.state.readMode && this.state.nodesReady && this.state.preview &&
						<SeparatorHandle
							forceUpdateSeparator={this.state.forceUpdateSeparator}
							containerNode={this.editorContainerNode}
							previewNode={this.previewNode}
						/>
					}

					<MarkdownView
						ref={this.markdownViewRef}
						markdown={this.state.markdown}
						isReadModeActive={this.state.readMode}
						isScrollSyncActive={this.state.scrollSync}
						scrollSyncPos={this.state.scrollSyncPosition}
					/>
				</InnerEditorContainer>
			</EditorContainer>			
		);
	}
}
