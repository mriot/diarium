import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import CodeMirror from "react-codemirror";
import EmojiPicker from "./emoji-picker";
import "codemirror/lib/codemirror.css";
import "../../themes/codemirror-callisto.css";
import "codemirror/mode/gfm/gfm";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/scroll/scrollpastend";
import "codemirror/addon/selection/active-line";
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/scroll/simplescrollbars.css";

const StyledCodeMirror = styled(CodeMirror) `
	flex: 1;
	height: 100%;
	overflow: hidden;

	.CodeMirror {
		height: 100%;

		.CodeMirror-activeline {
			.CodeMirror-linenumber {
				color: #888;
			}
		}

		/* move scrollbar to left side of the editor */
		.CodeMirror-overlayscroll-vertical {
			left: 0;
			right: auto;

			> div {
				right: auto;
				width: 5px;
				background-color: #2b2b2b;
			}
		}
	}
`;

export default class MarkdownEditor extends React.PureComponent {
	constructor(props) {
		super(props);

		this.codeMirrorRef = React.createRef();
		this.emojiPickerRef = React.createRef();
		this.CodeMirrorInstance = null;

		this.editorConfig = {
			mode: "gfm", // github flavored markdown
			theme: "callisto",
			tabSize: 2,
			fixedGutter: true,
			lineNumbers: true,
			lineWrapping: true,
			highlightFormatting: true,
			showCursorWhenSelecting: true,
			// ADDONS
			scrollPastEnd: true,
			styleActiveLine: true,
			autoCloseBrackets: true,
			// scrollbarStyle: "overlay",
		};

		this.state = {
			emojiPickerOpen: false,
			emojiQuery: "",
		};
	}

	componentDidMount() {
		// eslint-disable-next-line react/no-find-dom-node
		this.CodeMirrorNode = ReactDOM.findDOMNode(this.codeMirrorRef.current);
		this.CodeMirrorInstance = this.codeMirrorRef.current.getCodeMirror();

		this.editorFocus();

		this.CodeMirrorInstance.on("scroll", event => {
			this.props.scrollPosChange(event.doc.scrollTop);
		});
		
		this.CodeMirrorInstance.on("cursorActivity", () => {
			const cursorPos = this.getCursor();
			const lineContent = this.CodeMirrorInstance.getLine(cursorPos.line);
			if (!lineContent.includes(":")) return;
			
			// iterate over each char to the left of the current cursor position
			for (let charCounter = cursorPos.ch; charCounter >= 0; charCounter--) {
				const char = this.CodeMirrorInstance.getRange(
					{ line: cursorPos.line, ch: charCounter },
					{ line: cursorPos.line, ch: charCounter + 1 }
				);
				
				if (char !== ":") continue;
				
				const queryStartPos = {
					line: cursorPos.line,
					ch: charCounter + 1, // skip colon char
				};

				// the query is everything between colon and cursor
				const emojiQuery = this.CodeMirrorInstance.getRange(queryStartPos, cursorPos);
				this.setState({ emojiQuery });

				// move/append widget(= emoji picker) to where the cursor is
				this.CodeMirrorInstance.addWidget({
					line: cursorPos.line, ch: cursorPos.ch,
				}, ReactDOM.findDOMNode(this.emojiPickerRef.current));

				// we've found what we were looking for — stop the loop
				break;
			}
		});
	}

	componentDidUpdate(prevProps, prevState) {
		// only fire on newly created entries
		if (prevProps.content.length < 1 && prevProps.content !== this.props.content) {
			this.CodeMirrorInstance.setValue(this.props.content);
		}
	}

	getCursor() {
		return this.CodeMirrorInstance.getCursor();
	}

	editorFocus() {
		this.CodeMirrorInstance.focus();
	}

	editorUndo() {
		this.editorFocus();
		this.CodeMirrorInstance.undo();
	}

	editorRedo() {
		this.editorFocus();
		this.CodeMirrorInstance.redo();
	}

	insertCode() {
		this.editorFocus();
		this.CodeMirrorInstance.replaceSelection("```language\n\n````");
		this.CodeMirrorInstance.setCursor({
			line: this.getCursor().line - 1,
			ch: 0,
		});
	}

	insertLink() {
		this.editorFocus();
		this.CodeMirrorInstance.replaceSelection("[]()");
		this.CodeMirrorInstance.setCursor({
			line: this.getCursor().line,
			ch: this.getCursor().ch - 3,
		});
	}
	
	insertEmoji() {
		this.editorFocus();
		this.setState({ emojiPickerOpen: true });
	}

	render() {
		return (
			<>
				<StyledCodeMirror
					ref={this.codeMirrorRef}
					value={this.props.content}
					options={this.editorConfig}
					onChange={markdown => {
						this.props.change(markdown);
						this.props.getEditorHistory(this.CodeMirrorInstance.historySize());
					}}
				/>
				<EmojiPicker emojiQuery={this.state.emojiQuery} ref={this.emojiPickerRef} />
			</>
		);
	}
}

MarkdownEditor.propTypes = {
	content: PropTypes.string,
	scrollPosChange: PropTypes.func.isRequired,
	change: PropTypes.func.isRequired,
	getEditorHistory: PropTypes.func.isRequired,
};

MarkdownEditor.defaultProps = {
	content: "",
};
