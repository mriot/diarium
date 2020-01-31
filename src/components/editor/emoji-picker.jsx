import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { emojiIndex } from "emoji-mart";

const StyledEmojiPicker = styled.div `
	position: absolute;
	display: ${props => (props.pickerOpen ? "flex" : "none")};
	flex-wrap: wrap;
	padding: 5px 10px;
	border-radius: 3px;
	background-color: #333;
	z-index: 9999;
`;
const EmojiPreviewContainer = styled.div `
	span.emoji {
		font-size: 25px;
		margin: 5px;
    cursor: pointer;
    border-radius: 3px;
	}
`;

const Emoji = styled.span `
	${props => props.active && `
		box-shadow: 0 0 0 2px rgba(0, 165, 244, 0.4);
	`}
`;

export default class EmojiPicker extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.state = {
			emojis: null,
			highlightIndex: 0,
		};
	}

	componentDidMount() {
		document.addEventListener("keydown", event => this.handleKeyEvent(event.which));
	}
	
	componentDidUpdate(prevProps, prevState) {
		if (prevProps.emojiQuery !== this.props.emojiQuery) {
			this.searchEmojis(this.props.emojiQuery);
			this.setState({ highlightIndex: 0 });
		}
	}
	
	handleKeyEvent(key) {
		console.log({ key });

		// ENTER
		if (key === 13) {
			// TODO: insert emoji (replace query)
		}

		// left arrow
		if (key === 37 && this.state.highlightIndex >= 0) {
			this.setState(prevState => ({ highlightIndex: prevState.highlightIndex - 1 }));
		}
		
		// right arrow
		if (key === 39 && this.state.highlightIndex <= this.state.emojis?.length) {
			this.setState(prevState => ({ highlightIndex: prevState.highlightIndex + 1 }));
		}
	}

	searchEmojis(query) {
		if (!this.props.pickerOpen) return;
		
		const emojis = emojiIndex.search(this.props.emojiQuery);
		this.setState({ emojis });
	}

	render() {
		return (
			<StyledEmojiPicker pickerOpen={this.props.pickerOpen}>
				<EmojiPreviewContainer>
					{this.props.pickerOpen && this.state.emojis?.map((emoji, index) => (
						<Emoji className="emoji" active={this.state.highlightIndex === index} key={emoji.id}>{emoji.native}</Emoji>
					))}
				</EmojiPreviewContainer>
			</StyledEmojiPicker>
		);
	}
}

EmojiPicker.propTypes = {
	emojiQuery: PropTypes.string,
	pickerOpen: PropTypes.bool.isRequired,
};

EmojiPicker.defaultProps = {
	emojiQuery: "",
};
