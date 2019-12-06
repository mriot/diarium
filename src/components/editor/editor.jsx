import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import SeparatorHandle from "./separator-handle";
import MarkdownView from './markdown-view';
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
			markdown: `GitHub Flavored Markdown
========================

Everything from markdown plus GFM features:

## URL autolinking

Underscores_are_allowed_between_words.

## Strikethrough text

GFM adds syntax to strikethrough text, which is missing from standard Markdown.

~~Mistaken text.~~
~~**works with other formatting**~~

~~spans across
lines~~

## Fenced code blocks (and syntax highlighting)

\`\`\`javascript
for (var i = 0; i < items.length; i++) {
		console.log(items[i], i); // log them
}
\`\`\`

## Task Lists

- [ ] Incomplete task list item
- [x] **Completed** task list item

## A bit of GitHub spice

See http://github.github.com/github-flavored-markdown/.

(Set \`gitHubSpice: false\` in mode options to disable):

* SHA: be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
* User@SHA ref: mojombo@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
* User/Project@SHA: mojombo/god@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
* \#Num: #1
* User/#Num: mojombo#1
* User/Project#Num: mojombo/god#1

(Set \`emoji: false\` in mode options to disable):

* emoji: :smile:`,
			zenMode: false,
			nodesReady: false,
			renderPreview: true,
			scrollSync: true,
			previewWidthBackup: "50%",
			forceUpdateSeparator: 0,
			scrollSyncPosition: 0,
			editorHistory: {undo: 0, redo: 0},
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

	toggleScrollSync() {
		this.setState({scrollSync: !this.state.scrollSync})
	}

	resetLayout() {
		this.setState({
			zenMode: false,
			renderPreview: true,
			scrollSync: true,
			previewWidthBackup: "50%",
			forceUpdateSeparator: this.state.forceUpdateSeparator + 1,
		})

		this.editorNode.style.width = "50%";
		this.previewNode.style.width = "50%";
		this.previewNode.classList.remove("hidden");
		localStorage.setItem("preview-hidden", false);
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
					toggleScrollSync={this.toggleScrollSync.bind(this)}
					resetLayout={this.resetLayout.bind(this)}
					toolbarStatus={{
						zenModeActive: this.state.zenMode,
						previewActive: this.state.renderPreview,
						scrollSyncActive: this.state.scrollSync,
						editorHistory: this.state.editorHistory,
					}}
				/>

				<InnerContainer>
					<MarkdownEditor
						ref={this.markdownEditorRef}
						value={this.state.markdown}
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
						scrollSync={this.state.scrollSync && this.state.scrollSyncPosition}
						markdown={this.state.markdown}
						ref={this.markdownViewRef}
					/>
				</InnerContainer>
			</EditorContainer>			
		);
	}
}
