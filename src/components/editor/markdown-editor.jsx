import React from 'react';
import styled from 'styled-components';
import CodeMirror from "react-codemirror";
import "codemirror/lib/codemirror.css";
import "code-mirror-themes/themes/clouds-midnight.css"
import "codemirror/mode/markdown/markdown";

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
			mode: "markdown",
			lineNumbers: true,
			theme: "clouds-midnight",
			tabSize: 2,
			lineWrapping: true,
			fixedGutter: true,
			showCursorWhenSelecting: true,
			autofocus: true,
		}

		this.state = {
			
		}
	}

	componentDidMount() {
		this.CodeMirrorInstance = this.codeMirrorRef.current.getCodeMirror();
		this.CodeMirrorInstance.execCommand("goDocEnd");
	}

	componentDidUpdate(prevProps, prevState) {
		this.CodeMirrorInstance.focus()
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
