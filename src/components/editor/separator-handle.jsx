import React from 'react';
import ReactDOM from "react-dom";
import styled from 'styled-components';
import "../../utils/simpledrag";

const handleWidth = "5px";
const StyledSeparatorHandle = styled.div `
	position: absolute;
	height: 100%;
	width: ${handleWidth};
	background-color: #808080;
	cursor: col-resize;
	z-index: 10;
	transform: translateX(calc(${handleWidth} / 2 * -1));

	&:hover {
		box-shadow: -5px 0 10px rgba(0,0,0,0.3), 0 0 10px rgba(0,0,0,0.3);
	}
`

export default class SeparatorHandle extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.handleRef = React.createRef();

		this.handleNode = null;
		this.containerRect = null;
	}
	
	setCorrectSeparatorPosition() {
		this.handleNode.style.left = getComputedStyle(this.props.editorNode).width
	}

	componentDidUpdate(prevProps, prevState) {
		this.containerRect = this.props.containerNode.getBoundingClientRect();
		this.setCorrectSeparatorPosition();
	}

	componentDidMount() {
		this.handleNode = ReactDOM.findDOMNode(this.handleRef.current);
		this.containerRect = this.props.containerNode.getBoundingClientRect();

		let leftPaneWidth = 0;
		let rightPaneWidth = 0;

		this.setCorrectSeparatorPosition();

		window.addEventListener("resize", event => {
			this.containerRect = this.props.containerNode.getBoundingClientRect();
			this.setCorrectSeparatorPosition();
		})

		// using timeout hack to get the correct values
		setTimeout(() => this.setCorrectSeparatorPosition(), 0)

		// sdrag => from simpledrag.js library
		this.handleNode.sdrag(handle => {
			// hide separator if dragged outside of editor area
			if (handle.style.left.replace("px", "") <= 0) {
				handle.style.display = "none";
			} else {
				handle.style.display = "block";
			}

			// calcs percentage values for both views
			leftPaneWidth 	= handle.offsetLeft * 100 / this.containerRect.width;
			rightPaneWidth 	= 100 - leftPaneWidth;

			this.props.editorNode.style.width = leftPaneWidth + "%";
			this.props.previewNode.style.width = rightPaneWidth + "%";
		}, handle => {
			/**
			 * almost 1:1 copy of the above code.
			 * this fixes the problem with not perfectly aligned separator and panes
			 	 if the user is dragging very fast
			 */
			// if handle dropped outside of editor area, move it back to 0
			if (handle.style.left.replace("px", "") <= 0) {
				handle.style.left = 0;
				handle.style.display = "block";
			}

			leftPaneWidth 	= handle.offsetLeft * 100 / this.containerRect.width;
			rightPaneWidth 	= 100 - leftPaneWidth;

			this.props.editorNode.style.width = leftPaneWidth + "%";
			this.props.previewNode.style.width = rightPaneWidth + "%";
		}, 'horizontal');
	}
	
	render() {
		return (
			<StyledSeparatorHandle ref={this.handleRef} />
		);
	}
}
