import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import posed from "react-pose";
import PropTypes from "prop-types";
import { Editor as DraftEditor, EditorState, RichUtils } from "draft-js";
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

export default class Editor extends React.PureComponent {
	constructor(props) {
		super(props);

		this.lastDayRecordID = -1;
		this.wasInEditMode = false;
		this.saveTimeout = null;

		this.state = {
			zenMode: false,
			editorHistory: { undo: 0, redo: 0 },
			saveStatusText: "",
			editorState: EditorState.createEmpty(),
		};

		this.onChange = editorState => this.setState({ editorState });
	}

	componentDidMount() {
		
	}

	componentDidUpdate(prevProps, prevState) {
		const { GLOBAL_DAYRECORD, GLOBAL_READMODE } = this.context;
		
		// handling autosave on leaving edit mode
		if (GLOBAL_DAYRECORD) {
			if (this.saveTimeout && GLOBAL_READMODE && this.wasInEditMode) {
				console.log("Autosave on leaving edit mode...");
				clearTimeout(this.saveTimeout);
				//this.saveContent();
			}
		}

		// selected day has changed -> load content / placeholder into state
		if (!GLOBAL_DAYRECORD || this.lastDayRecordID !== GLOBAL_DAYRECORD.id) {
			console.log("selected day has changed");
		}

		this.lastDayRecordID = GLOBAL_DAYRECORD ? GLOBAL_DAYRECORD.id : -1;
		this.wasInEditMode = !GLOBAL_READMODE;
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
		/*
		this.setState({ markdown: editedMarkdown });
		// clear timeout while the user is typing
		clearTimeout(this.saveTimeout);
		// after X time of not typing, save content
		this.saveTimeout = setTimeout(() => {
			this.saveContent();
			this.saveTimeout = undefined;
		}, 1000);
		*/
	}

	toggleZenMode(force) {
		this.setState(prevState => ({
			zenMode: typeof force === "undefined" ? !prevState.zenMode : force,
			forceUpdateSeparator: prevState.forceUpdateSeparator + 1,
		}));
	}

	_onBoldClick() {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
	}

	render() {
		const { zenMode, editorHistory, saveStatusText } = this.state;
		const { GLOBAL_READMODE } = this.context;

		return (
			<EditorContainer
				ref={this.editorContainerRef}
				pose={this.props.pose}
				isZenModeActive={zenMode}
			>
				<Toolbar
					// call markdown-editor methods
					// editorFocus={() => this.markdownEditorRef.editorFocus()}
					// editorUndo={() => this.markdownEditorRef.editorUndo()}
					// editorRedo={() => this.markdownEditorRef.editorRedo()}
					// insertCode={() => this.markdownEditorRef.insertCode()}
					// insertLink={() => this.markdownEditorRef.insertLink()}
					// provides everything the Toolbar needs to know
					toolbarStatus={{
						readModeActive: GLOBAL_READMODE,
						zenModeActive: zenMode,
						editorHistory,
						saveStatusText,
					}}
				/>

				<button onClick={() => this._onBoldClick()}>Bold</button>
				<DraftEditor editorState={this.state.editorState} onChange={this.onChange} />

			</EditorContainer>
		);
	}
}

Editor.propTypes = {
	pose: PropTypes.string.isRequired,
};

Editor.defaultProp = {};

Editor.contextType = GlobalContext;
