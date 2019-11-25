import React from 'react';
import styled from 'styled-components';
import Editor from 'for-editor'

const ViewContainer = styled.div `

`
const EditorContainer = styled.div `
	width: 100%;
  position: relative;
	background-color: #555;
	display: flex;
`
const SeparatorHandle = styled.div `
	position: absolute;
	left: 50%;
	height: 100%;
	width: 7px;
	background-color: #777;
	cursor: col-resize;
`

export default class MarkdownEditor extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.state = {
			markdown: "# Hello World!",
			viewMode: false
		}
	}

	render() {
		return (
			<>
				{this.state.viewMode &&
					<ViewContainer>
						{this.state.markdown}
					</ViewContainer>
				}
				{!this.state.viewMode &&
					<EditorContainer>
						<Editor
							style={{
								"width": "100%",
								"height": "100%"
							}}
							language={"en"}
							subfield={true}
							preview={true}
							toolbar={{
								h1: false,
								h2: false,
								h3: false,
								h4: false,
								img: true,
								link: true,
								code: true,
								preview: false,
								expand: true,
								undo: true,
								redo: true,
								save: true,
								subfield: true
							}}
							value={this.state.markdown}
							onChange={value => this.setState({markdown: value})}
						/>
					</EditorContainer>
				}
			</>
		);
	}
}
