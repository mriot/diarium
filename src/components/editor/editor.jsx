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
	
		this.editorContainer = React.createRef();
		this.markdownView = React.createRef();
		this.markdownEditor = React.createRef();

		this.state = {
			markdown: "# Hello World!",
			viewMode: false,
			zenMode: false,
			nodesReady: false,
			renderSeparator: true,
			previewWidthBackup: "50%",
		}
	}

	componentDidMount() {
		this.markdownContainer = ReactDOM.findDOMNode(this.editorContainer.current);
		this.editorNode = ReactDOM.findDOMNode(this.markdownEditor.current);
		this.viewNode = ReactDOM.findDOMNode(this.markdownView.current);

		this.editorNode.style.width = "50%";
		this.viewNode.style.width = "50%";

		this.setState({nodesReady: true});
	}

	togglePreview(status = !this.state.renderSeparator) {
		this.setState({renderSeparator: status})
		if (status) {
			this.editorNode.style.width = this.state.previewWidthBackup;
			this.viewNode.classList.remove("hidden");
		} else {
			this.setState({previewWidthBackup: this.editorNode.style.width});
			this.editorNode.style.width = "100%";
			this.viewNode.classList.add("hidden");
		}
	}

	toggleZenMode() {
		this.setState({zenMode: !this.state.zenMode}, () => 
			this.state.zenMode && this.togglePreview(false)
		)
	}

	render() {
		return (
			<EditorContainer className={this.state.zenMode ? "zen-mode" : ""}>
				<Toolbar 
					toggleZenMode={this.toggleZenMode.bind(this)}
					togglePreview={this.togglePreview.bind(this)}
					toolbarStatus={{
						zenModeActive: this.state.zenMode,
						previewActive: this.state.renderSeparator,
					}}
				/>
				<InnerContainer>
					<MarkdownEditor
						ref={this.markdownEditor}
						value={this.state.markdown}
						change={markdown => {
							this.setState({markdown})
							console.log(markdown)
						}}
					/>

					{/* {this.state.nodesReady &&
						<SeparatorHandle
							hidden={!this.state.renderSeparator}
							containerNode={this.markdownContainer}
							editorNode={this.editorNode}
							viewNode={this.viewNode}
						/>
					} */}

					<MarkdownView markdown={this.state.markdown} ref={this.markdownView} />
				</InnerContainer>
			</EditorContainer>			
		);
	}
}
