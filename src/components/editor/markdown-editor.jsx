import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import CodeMirror from "react-codemirror";
import { createPopper } from "@popperjs/core";
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
		this.queryRange = null;
		this.emojiSearchResultCount = 0;

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
		this.CodeMirrorInstance = this.codeMirrorRef.current.getCodeMirror();
		this.CodeMirrorNode = ReactDOM.findDOMNode(this.codeMirrorRef.current);
		this.emojiPickerNode = ReactDOM.findDOMNode(this.emojiPickerRef.current);

		this.editorFocus();

		this.CodeMirrorInstance.on("keydown", (cm, event) => {
			if (this.state.emojiPickerOpen && this.emojiSearchResultCount > 0) {
				switch (event.which) {
				case 37: // left arrow
					event.preventDefault();
					break;
				case 39: // right arrow
					event.preventDefault();
					break;
				case 27: // ESC
					this.setState({ emojiPickerOpen: false });
					break;
				case 13: // ENTER
					event.preventDefault();
					break;
				default:
					break;
				}
			}
		});

		this.CodeMirrorInstance.on("scroll", event => {
			this.props.scrollPosChange(event.doc.scrollTop);
		});
		
		this.CodeMirrorInstance.on("cursorActivity", () => {
			const cursorPos = this.getCursor();
			const lineContent = this.CodeMirrorInstance.getLine(cursorPos.line);
			if (!lineContent.includes(":")) {
				this.setState({ emojiPickerOpen: false });
				return;
			}
			
			// iterate over each char to the left of the current cursor position
			for (let charCounter = cursorPos.ch; charCounter >= 0; charCounter--) {
				const char = this.CodeMirrorInstance.getRange(
					{ line: cursorPos.line, ch: charCounter },
					{ line: cursorPos.line, ch: charCounter + 1 }
				);
				if (char !== ":") {
					this.setState({ emojiPickerOpen: false });
					continue;
				}

				const charB4Colon = this.CodeMirrorInstance.getRange(
					{ line: cursorPos.line, ch: charCounter - 1 },
					{ line: cursorPos.line, ch: charCounter }
				);
				// charB4Colon has to be either a "not word boundary", a tab or a space
				if (!charB4Colon.match(/\B|\s+|\t+/)) {
					this.setState({ emojiPickerOpen: false });
					continue;
				}
				
				const queryStartPos = {
					line: cursorPos.line,
					ch: charCounter, // incl. colon
				};
					
				// used later to replace the query with the choosen emoji
				this.queryRange = {
					start: queryStartPos,
					end: cursorPos,
				};

				// the query is everything between colon and cursor (we cut the colon off)
				const emojiQuery = this.CodeMirrorInstance.getRange(queryStartPos, cursorPos).slice(1);
				if (emojiQuery.length < 1) {
					this.setState({ emojiPickerOpen: false });
					return;
				}

				this.setState({
					emojiQuery,
					emojiPickerOpen: true,
				});

				// move/append widget(= emoji picker) to where the cursor is
				this.CodeMirrorInstance.addWidget({
					line: cursorPos.line, ch: cursorPos.ch,
				}, this.emojiPickerNode, true);

				// this.CodeMirrorInstance.addLineWidget(cursorPos.line, this.emojiPickerNode, {
				// 	coverGutter: false,
				// 	noHScroll: true,
				// 	above: false,
				// 	handleMouseEvents: true,
				// });

				const cursorCoords = this.CodeMirrorInstance.cursorCoords(true, "local");
				console.log(cursorCoords);
				this.emojiPickerNode.style.top = `${cursorCoords.top + 25}px`;
				this.emojiPickerNode.style.left = `${cursorCoords.left}px`;

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

	insertEmoji(emoji) {
		this.editorFocus();
		this.CodeMirrorInstance.replaceRange(emoji.native, this.queryRange.start, this.queryRange.end);
		this.setState({
			emojiQuery: "",
			emojiPickerOpen: false,
		});
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
		// this.CodeMirrorInstance.replaceSelection("[]()");
		// this.CodeMirrorInstance.setCursor({
		// 	line: this.getCursor().line,
		// 	ch: this.getCursor().ch - 3,
		// });
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
				<EmojiPicker
					pickerOpen={this.state.emojiPickerOpen}
					emojiQuery={this.state.emojiQuery}
					emojiSearchResultCount={count => (this.emojiSearchResultCount = count || 0)}
					insertEmoji={emoji => this.insertEmoji(emoji)}
					ref={this.emojiPickerRef}
				/>
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
