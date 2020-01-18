import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import posed from "react-pose";
import PropTypes from "prop-types";
import SeparatorHandle from "./separator-handle";
import MarkdownView from "./markdown-view";
import MarkdownEditor from "./markdown-editor";
import Toolbar from "./toolbar";
import { editorAnimation } from "./animations";
import { GlobalContext } from "../../contexts";
import { updateExistingEntryById } from "../../lib/backend";

const PosedEditorContainer = posed.div(editorAnimation);
const EditorContainer = styled(PosedEditorContainer) `
	display: flex;
	width: 100%;
	height: 100%;
  position: relative;
	flex-direction: column;
	transform-origin: center;
	backface-visibility: hidden;

	${props => props.isZenModeActive && `
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
	`}
`;

const InnerEditorContainer = styled.div `
  position: relative;
	display: flex;
	overflow: auto;
	width: 100%;
	height: 100%;
`;

export default class Editor extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.editorContainerRef = React.createRef();
		this.markdownViewRef = React.createRef();

		this.backup = {
			scrollSyncPreference: true,
		};

		this.state = {
			markdown: "",
			readMode: this.props.isReadModeActive,
			zenMode: false,
			nodesReady: false,
			preview: true,
			scrollSync: true,
			forceUpdateSeparator: 0,
			scrollSyncPosition: 0,
			editorHistory: { undo: 0, redo: 0 },
			saveStatusText: "",
		};
	}

	componentDidMount() {
		this.setUpSeparator();
		
		// whether to show preview or not
		if (!this.state.readMode && localStorage.getItem("preview-hidden") === "true") {
			this.hidePreview();
		}

		// always focus editor on 'tab'
		document.addEventListener("keydown", event => {
			if (event.which === 9 && this.markdownEditorRef) {
				event.preventDefault();
				this.markdownEditorRef.editorFocus();
			}
		});
	}

	componentDidUpdate(prevProps, prevState) {
		const { isReadModeActive } = this.props;
		const { GLOBAL_DAYRECORD } = this.context;

		this.setUpSeparator();

		// don't load fetched markdown into state while we're in edit mode
		if (isReadModeActive) {
			this.setState({ markdown: dayRecord ? dayRecord.content : "" });
		}

		if (prevProps.isReadModeActive !== isReadModeActive) {
			this.setState({ readMode: isReadModeActive });
		}
	}

	// eslint-disable-next-line react/sort-comp
	saveContent() {
		const { GLOBAL_DAYRECORD, UPDATE_GLOBAL_DAYRECORD } = this.context;

		if (!GLOBAL_DAYRECORD) throw new Error("Can't save to not existing entry!");
		this.setState({ saveStatusText: "Speichern..." });

		updateExistingEntryById(GLOBAL_DAYRECORD.id, {
			content: this.state.markdown,
		})
			.then(result => {
				if (!result.error) {
					UPDATE_GLOBAL_DAYRECORD(result);
					this.setState({ saveStatusText: "Gespeichert!" });
				} else {
					this.setState({ saveStatusText: `Speichern fehlgeschlagen! ${result.error}` });
					console.log("Could not save content", result.error);
				}
			})
			.catch(error => console.log(error));
	}

	setUpSeparator() {
		if (!this.state.nodesReady) {
			this.editorContainerNode = ReactDOM.findDOMNode(this.editorContainerRef.current);
			this.previewNode = ReactDOM.findDOMNode(this.markdownViewRef.current);
			// render separator when all node refs are available
			if (this.editorContainerNode && this.previewNode) this.setState({ nodesReady: true });
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
		this.setState(prevState => ({
			zenMode: typeof force === "undefined" ? !prevState.zenMode : force,
			forceUpdateSeparator: prevState.forceUpdateSeparator + 1,
		}));
	}

	toggleScrollSync(force) {
		this.setState(prevState => ({
			scrollSync: typeof force === "undefined" ? !prevState.scrollSync : force,
		}));
	}

	resetEditorLayout() {
		this.backup = {};

		this.showPreview();
		this.toggleScrollSync(true);
		this.toggleZenMode(false);

		this.previewNode.style.width = "";

		this.setState(prevState => ({ forceUpdateSeparator: prevState.forceUpdateSeparator + 1 }));
	}

	render() {
		const {
			readMode, zenMode, preview, scrollSync, editorHistory, saveStatusText,
			markdown, nodesReady, forceUpdateSeparator, scrollSyncPosition,
		} = this.state;

		return (
			<EditorContainer
				ref={this.editorContainerRef}
				pose={this.props.pose}
				isZenModeActive={zenMode}
			>
				<Toolbar
					// call markdown-editor methods
					editorFocus={() => this.markdownEditorRef.editorFocus()}
					editorUndo={() => this.markdownEditorRef.editorUndo()}
					editorRedo={() => this.markdownEditorRef.editorRedo()}
					insertCode={() => this.markdownEditorRef.insertCode()}
					insertLink={() => this.markdownEditorRef.insertLink()}
					// called directly here
					toggleZenMode={() => this.toggleZenMode()}
					togglePreview={preview ? () => this.hidePreview() : () => this.showPreview()}
					toggleScrollSync={() => this.toggleScrollSync()}
					resetEditorLayout={() => this.resetEditorLayout()}
					// provides everything the Toolbar needs to know
					toolbarStatus={{
						readModeActive: readMode,
						zenModeActive: zenMode,
						previewActive: preview,
						scrollSyncActive: scrollSync,
						editorHistory,
						saveStatusText,
					}}
				/>

				<InnerEditorContainer>
					{!readMode && (
						<MarkdownEditor
							ref={ref => (this.markdownEditorRef = ref)}
							content={markdown}
							change={editedMarkdown => this.setState({ markdown: editedMarkdown })}
							saveContent={() => this.saveContent()}
							scrollPosChange={pos => this.setState({ scrollSyncPosition: pos })}
							getEditorHistory={history => this.setState({ editorHistory: history })}
						/>
					)}

					{!readMode && nodesReady && preview && (
						<SeparatorHandle
							forceUpdateSeparator={forceUpdateSeparator}
							containerNode={this.editorContainerNode}
							previewNode={this.previewNode}
						/>
					)}

					<MarkdownView
						ref={this.markdownViewRef}
						markdown={markdown}
						isReadModeActive={readMode}
						isScrollSyncActive={scrollSync}
						scrollSyncPos={scrollSyncPosition}
					/>
				</InnerEditorContainer>
			</EditorContainer>
		);
	}
}

Editor.propTypes = {
	isReadModeActive: PropTypes.bool.isRequired,
	pose: PropTypes.string.isRequired,
};

Editor.defaultProp = {};

Editor.contextType = GlobalContext;
