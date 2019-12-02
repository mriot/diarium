import React from 'react';
import styled from 'styled-components';
import CodeMirror from "react-codemirror";
import "codemirror/lib/codemirror.css";
import "code-mirror-themes/themes/clouds-midnight.css"
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/gfm/gfm";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchtags";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/continuelist";
import "codemirror/addon/scroll/scrollpastend";
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/scroll/simplescrollbars.css";

const StyledCodeMirror = styled(CodeMirror) `
	width: 50%;
	height: 100%;

	& .CodeMirror {
		height: 100%;
	}
`

export default class MarkdownEditor extends React.PureComponent {
	constructor(props) {
		super(props);

		this.codeMirrorRef = React.createRef();

		this.CodeMirrorInstance = null;

		this.editorConfig = {
			mode: "gfm",
			lineNumbers: true,
			theme: "clouds-midnight",
			tabSize: 2,
			lineWrapping: true,
			fixedGutter: true,
			showCursorWhenSelecting: true,
			autofocus: true,

			// addon settings
			matchBrackets: true,
			autoCloseBrackets: true,
			matchTags: true,
			autoCloseTags: true,
			scrollbarStyle: "simple",
			scrollPastEnd: true,
		}
	}

	componentDidMount() {
		this.CodeMirrorInstance = this.codeMirrorRef.current.getCodeMirror();
		this.CodeMirrorInstance.execCommand("goLineEnd");

		this.CodeMirrorInstance.on("scroll", event => {
			this.props.scrollPosChange(event.doc.scrollTop)
		})

		this.props.shareMethods({
			insertCode: this.insertCode.bind(this),
			insertLink: this.insertLink.bind(this),
			editorUndo: this.editorUndo.bind(this),
			editorRedo: this.editorRedo.bind(this),
			editorFocus: this.editorFocus.bind(this),
		});
	}

	componentDidUpdate(prevProps, prevState) {
		this.editorFocus()
	}

	editorFocus() {
		this.CodeMirrorInstance.focus()
	}

	editorUndo() {
		this.CodeMirrorInstance.undo()
	}

	editorRedo() {
		this.CodeMirrorInstance.redo()
	}

	insertCode() {
		this.CodeMirrorInstance.replaceSelection("```language\n\n````");
		const cursorPos = this.CodeMirrorInstance.getCursor();
		this.CodeMirrorInstance.setCursor({line: cursorPos.line - 1, ch: 0});
	}

	insertLink() {
		this.CodeMirrorInstance.replaceSelection("[]()");
		const cursorPos = this.CodeMirrorInstance.getCursor();
		this.CodeMirrorInstance.setCursor({line: cursorPos.line, ch: cursorPos.ch - 3});
	}

	render() {
		return (
			<StyledCodeMirror
				ref={this.codeMirrorRef}
				value={this.props.value}
				onChange={markdown => {
					this.props.change(markdown)
				}}
				options={this.editorConfig}
			/>
		);
	}
}
