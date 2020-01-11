import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import CodeMirror from "react-codemirror";
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
			scrollbarStyle: "overlay",
		};
	}

	componentDidMount() {
		this.CodeMirrorNode = ReactDOM.findDOMNode(this.codeMirrorRef.current);
		this.CodeMirrorInstance = this.codeMirrorRef.current.getCodeMirror();

		this.CodeMirrorInstance.on("scroll", event => {
			this.props.scrollPosChange(event.doc.scrollTop);
		});
	}

	componentDidUpdate(prevProps, prevState) {
		const { content } = this.props;

		if (prevProps.content !== content) {
			this.editorFocus();
			this.CodeMirrorInstance.setValue(content);
			this.CodeMirrorInstance.execCommand("goLineEnd");
		}
	}

	getCursor() {
		return this.CodeMirrorInstance.getCursor();
	}

	editorFocus() {
		this.CodeMirrorInstance.focus();
	}

	editorUndo() {
		this.CodeMirrorInstance.undo();
	}

	editorRedo() {
		this.CodeMirrorInstance.redo();
	}

	insertCode() {
		this.CodeMirrorInstance.replaceSelection("```language\n\n````");
		this.CodeMirrorInstance.setCursor({
			line: this.getCursor().line - 1,
			ch: 0
		});
	}

	insertLink() {
		this.CodeMirrorInstance.replaceSelection("[]()");
		this.CodeMirrorInstance.setCursor({
			line: this.getCursor().line,
			ch: this.getCursor().ch - 3
		});
	}

	render() {
		return (
			<StyledCodeMirror
				ref={this.codeMirrorRef}
				value={this.props.content}
				options={this.editorConfig}
				onChange={markdown => {
					this.props.change(markdown);
					this.props.getEditorHistory(this.CodeMirrorInstance.historySize());
				}}
			/>
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
	content: ""
};
