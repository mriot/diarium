import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import marked from "marked";
import { withRouter } from "react-router-dom";

const placeholderText = "## Für diesen Tag gibt es noch keinen Eintrag.\n\n### Leg' doch einen an! 😇";
const ParsedMarkdown = styled.div `
	${props => props.showPlaceholderText && `
		position: absolute;
		top: 30%;
		left: 50%;
		width: fit-content;
		transform: translateX(-50%);
		text-align: center;
	`}
`;

const renderer = new marked.Renderer();
renderer.link = (href, title, text) => {
	return (
		`<a href=${href} title=${title} class="hotlink">${text}</a>`
	);
};

class MarkdownParser extends React.PureComponent {
	componentDidMount() {
		document.addEventListener("click", event => {
			if (event.target !== document.querySelector("a.hotlink")) return;
			event.preventDefault();
			if (!this.props.isReadModeActive) return;
			this.props.history.push(event.target.pathname);
		});
	}
	
	render() {
		const { isReadModeActive, markdown } = this.props;
		const showPlaceholderText = !markdown && isReadModeActive;

		return (
			<ParsedMarkdown
				showPlaceholderText={showPlaceholderText}
				dangerouslySetInnerHTML={{
					__html: marked(showPlaceholderText ? placeholderText : markdown, {
						// https://marked.js.org/#/USING_ADVANCED.md#options
						gfm: true,
						breaks: true,
						renderer,
					}),
				}}
			/>
		);
	}
}

MarkdownParser.propTypes = {
	markdown: PropTypes.string,
	isReadModeActive: PropTypes.bool.isRequired,
	history: PropTypes.object.isRequired,
};

MarkdownParser.defaultProps = {
	markdown: "",
};

export default withRouter(MarkdownParser); // => props.history
