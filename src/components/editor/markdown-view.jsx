import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import "../../themes/markdown-ceres.css";
import "../../themes/markdown-vesta.css";
import MarkdownParser from "./markdown-parser";

const RenderedMarkdownContainer = styled.div `
	width: 50%;
	padding: 0 5px;
	box-sizing: border-box;

	${props => props.isReadModeActive && `
		width: 100% !important;
		padding: 0 50px;
	`}
	
	/* toggled in Editor -> showPreview() and hidePreview() */
	&.hidden {
		width: 0 !important;
		padding: 0;
	}
`;

export default class MarkdownView extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.markdownOutputRef = React.createRef();
	}
	
	componentDidMount() {
		// eslint-disable-next-line react/no-find-dom-node
		this.markdownOutputNode = ReactDOM.findDOMNode(this.markdownOutputRef.current);
		this.markdownOutputNode.scrollTop = this.props.scrollSyncPos;
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.isScrollSyncActive) {
			this.markdownOutputNode.scrollTop = this.props.scrollSyncPos;
		}
	}
	
	render() {
		const { isReadModeActive, markdown } = this.props;
		return (
			<RenderedMarkdownContainer
				ref={this.markdownOutputRef}
				className="markdown-body"
				isReadModeActive={isReadModeActive}
			>
				<MarkdownParser markdown={markdown} isReadModeActive={isReadModeActive} />
			</RenderedMarkdownContainer>
		);
	}
}

MarkdownView.propTypes = {
	markdown: PropTypes.string,
	scrollSyncPos: PropTypes.number.isRequired,
	isReadModeActive: PropTypes.bool.isRequired,
	isScrollSyncActive: PropTypes.bool.isRequired,
};

MarkdownView.defaultProps = {
	markdown: "",
};
