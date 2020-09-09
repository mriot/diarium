import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import posed from "react-pose";
import PropTypes from "prop-types";
import { Editor as DraftEditor, EditorState, RichUtils } from "draft-js";
import SeparatorHandle from "./separator-handle";
import MarkdownView from "./markdown-view";
import MarkdownEditor from "./markdown-editor";
import Toolbar from "./toolbar";
import { editorAnimation } from "./animations";
import { GlobalContext } from "../../contexts";
import { updateExistingEntryById } from "../../lib/backend";
import "draft-js/dist/Draft.css";

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

		this.lastDayRecordID = -1;
		this.wasInEditMode = false;
		this.saveTimeout = null;

		this.backup = {
			scrollSyncPreference: true,
		};

		this.state = {
			markdown: "",
			zenMode: false,
			nodesReady: false,
			preview: true,
			scrollSync: true,
			forceUpdateSeparator: 0,
			scrollSyncPosition: 0,
			editorHistory: { undo: 0, redo: 0 },
			saveStatusText: "",
			editorState: EditorState.createEmpty(),
		};

		this.onChange = editorState => this.setState({ editorState });
	}

	componentDidMount() {
		this.setUpSeparator();

		// whether to show preview or not
		if (!this.context.GLOBAL_READMODE && localStorage.getItem("preview-hidden") === "true") {
			this.hidePreview();
		}

		// focus editor on pressing TAB key
		document.addEventListener("keydown", event => {
			if (event.which === 9 && this.markdownEditorRef) {
				event.preventDefault();
				this.markdownEditorRef.editorFocus();
			}
		});

		setInterval(() => {
			console.log("Editor contents", this.state.editorState);
		}, 1000);
	}

	componentDidUpdate(prevProps, prevState) {
		const { GLOBAL_DAYRECORD, GLOBAL_READMODE } = this.context;
		
		// handling autosave on leaving edit mode
		if (GLOBAL_DAYRECORD) {
			if (this.saveTimeout && GLOBAL_READMODE && this.wasInEditMode) {
				console.log("Autosave on leaving edit mode...");
				clearTimeout(this.saveTimeout);
				this.saveContent();
			}
		}

		// selected day has changed -> load content / placeholder into state
		if (!GLOBAL_DAYRECORD || this.lastDayRecordID !== GLOBAL_DAYRECORD.id) {
			this.setState({ markdown: GLOBAL_DAYRECORD ? GLOBAL_DAYRECORD.content : "" });
		}

		this.lastDayRecordID = GLOBAL_DAYRECORD ? GLOBAL_DAYRECORD.id : -1;
		this.wasInEditMode = !GLOBAL_READMODE;
	}

	setUpSeparator() {
		if (!this.state.nodesReady) {
			// eslint-disable-next-line react/no-find-dom-node
			this.editorContainerNode = ReactDOM.findDOMNode(this.editorContainerRef.current);
			// eslint-disable-next-line react/no-find-dom-node
			this.previewNode = ReactDOM.findDOMNode(this.markdownViewRef.current);
			// render separator when all node refs are available
			if (this.editorContainerNode && this.previewNode) this.setState({ nodesReady: true });
		}
	}

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

	handleContentChange(editedMarkdown) {
		this.setState({ markdown: editedMarkdown });
		// clear timeout while the user is typing
		clearTimeout(this.saveTimeout);
		// after X time of not typing, save content
		this.saveTimeout = setTimeout(() => {
			this.saveContent();
			this.saveTimeout = undefined;
		}, 1000);
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

	_onBoldClick() {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
	}

	render() {
		const {
			zenMode, preview, scrollSync, editorHistory, saveStatusText,
			markdown, nodesReady, forceUpdateSeparator, scrollSyncPosition,
		} = this.state;

		const { GLOBAL_READMODE } = this.context;

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
						readModeActive: GLOBAL_READMODE,
						zenModeActive: zenMode,
						previewActive: preview,
						scrollSyncActive: scrollSync,
						editorHistory,
						saveStatusText,
					}}
				/>

				<button onClick={this._onBoldClick.bind(this)}>Bold</button>
				<DraftEditor editorState={this.state.editorState} onChange={this.onChange} />

				<InnerEditorContainer>
					{!GLOBAL_READMODE && (
						<MarkdownEditor
							ref={ref => (this.markdownEditorRef = ref)}
							content={markdown}
							change={editedMarkdown => this.handleContentChange(editedMarkdown)}
							saveContent={() => this.saveContent()}
							scrollPosChange={pos => this.setState({ scrollSyncPosition: pos })}
							getEditorHistory={history => this.setState({ editorHistory: history })}
						/>
					)}

					{!GLOBAL_READMODE && nodesReady && preview && (
						<SeparatorHandle
							forceUpdateSeparator={forceUpdateSeparator}
							containerNode={this.editorContainerNode}
							previewNode={this.previewNode}
						/>
					)}

					<MarkdownView
						ref={this.markdownViewRef}
						markdown={markdown}
						isReadModeActive={GLOBAL_READMODE}
						isScrollSyncActive={scrollSync}
						scrollSyncPos={scrollSyncPosition}
					/>
				</InnerEditorContainer>
			</EditorContainer>
		);
	}
}

Editor.propTypes = {
	pose: PropTypes.string.isRequired,
};

Editor.defaultProp = {};

Editor.contextType = GlobalContext;
