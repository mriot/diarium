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
	/* box-shadow: -5px 0 10px rgba(0,0,0,0.3), 0 0 10px rgba(0,0,0,0.3); */
	cursor: col-resize;
	z-index: 10;
	transform: translateX(calc(${handleWidth} / 2 * -1));

	&.hidden {
		display: none !important;
	}
`

export default class SeparatorHandle extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.handle = React.createRef();

		this.state = {

		}
	}

	componentDidMount() {
		const node = ReactDOM.findDOMNode(this.handle.current);
		const containerRect = this.props.containerNode.getBoundingClientRect();

		let leftPaneWidth;
		let rightPaneWidth;

		node.style.left = containerRect.width / 2 + "px";

		node.sdrag(handle => {
			if (handle.style.left.replace("px", "") < 0) {
				handle.style.display = "none";
			} else {
				handle.style.display = "block";
			}

			leftPaneWidth 	= handle.offsetLeft * 100 / containerRect.width;
			rightPaneWidth 	= 100 - leftPaneWidth;

			this.props.editorNode.style.width = leftPaneWidth + "%";
			this.props.viewNode.style.width = rightPaneWidth + "%";

		}, element => {
			if (element.style.left.replace("px", "") < 0) {
				element.style.left = 0;
			}

			element.style.display = "block";

			leftPaneWidth 	= element.offsetLeft * 100 / containerRect.width;
			rightPaneWidth 	= 100 - leftPaneWidth;

			this.props.editorNode.style.width = leftPaneWidth + "%";
			this.props.viewNode.style.width = rightPaneWidth + "%";
		}, 'horizontal');
	}
	
	render() {
		return (
			<StyledSeparatorHandle ref={this.handle} className={this.props.hidden ? "hidden": ""} />
		);
	}
}
