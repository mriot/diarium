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
		
		this.CodeMirrorInstance.on("cursorActivity", (...args) => {
			const lineContent = this.CodeMirrorInstance.getLine(this.getCursor().line);
			if (!lineContent.includes(":")) return;

			let counter = this.getCursor().ch;

			do {
				const content = this.CodeMirrorInstance.getRange({
					line: this.getCursor().line,
					ch: counter,
				}, {
					line: this.getCursor().line,
					ch: counter + 1,
				});

				// console.log(counter, content);
				counter--;

				if (content === ":") {
					const colonPos = {
						line: this.getCursor().line,
						ch: counter + 2, // skip colon char
					};
					// console.log("FOUND CLOSEST COLON AT", colonPos);

					const emojiQuery = this.CodeMirrorInstance.getRange(colonPos, this.getCursor());
					// console.log({ emojiQuery });
					this.setState({ emojiQuery });

					/* * /
					this.CodeMirrorInstance.addLineWidget(
						this.getCursor().line, ReactDOM.findDOMNode(this.emojiPickerRef.current), {
							above: false,
						}
					);
					/* */

					/* * /
					this.CodeMirrorInstance.addWidget({
						line: this.getCursor().line, ch: this.getCursor().ch,
					}, ReactDOM.findDOMNode(this.emojiPickerRef.current));
					/* */

					break;
				}
			} while (counter >= 0);
		});

		/*
		this.CodeMirrorInstance.on("change", (event, changeObj) => {
			// console.log(event, changeObj);

			const lineContent = this.CodeMirrorInstance.getLine(this.getCursor().line);
			// if (changeObj.text === ":") {
			// 	console.log(": inserted");
			// 	this.lastTypedColonPosition;
			// }
			if (!lineContent.includes(":")) return;

			// find pos of last ":" in line which is BEFORE the cursor pos
			// query from : position to current cursor postion 
			// const query = this.CodeMirrorInstance.getRange({

			// }, this.getCursor());

			// match words after " :" until encountering a space
			const regex3 = /\s{1,}:([^\s]+)/ig; // ignore " :" in match
			// TODO: remove space check before? Does not work on new lines
			const regex4 = /\s{1,}:([^\s]+)/ig;

			const result = lineContent.matchAll(regex4);
			const resultArray = Array.from(result, arr => arr[1]); // get emoji names

			// console.log(resultArray);
		});
		*/
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
