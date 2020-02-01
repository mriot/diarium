import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { emojiIndex } from "emoji-mart";

const StyledEmojiPicker = styled.div `
	position: absolute;
	display: ${props => (props.pickerOpen ? "flex" : "none")};
	flex-wrap: wrap;
	padding: 5px;
	border-radius: 3px;
	background-color: #333;
	z-index: 9999;
`;

const Emoji = styled.span `
	display: inline-block;
	font-size: 25px;
	margin: 5px;
	cursor: pointer;
	border-radius: 3px;

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
		if (!this.props.pickerOpen) return;

		// ENTER
		if (key === 13 && this.state.emojis?.length) {
			this.props.insertEmoji(this.state.emojis[this.state.highlightIndex]);
		}

		// left arrow
		if (key === 37) {
			this.setState(prevState => ({
				highlightIndex: Math.max(prevState.highlightIndex - 1, 0),
			}));
		}
		
		// right arrow
		if (key === 39) {
			this.setState(prevState => ({
				highlightIndex: Math.min(prevState.highlightIndex + 1, prevState.emojis?.length - 1),
			}));
		}
	}

	searchEmojis() {
		if (!this.props.pickerOpen) return;
		
		const emojis = emojiIndex.search(this.props.emojiQuery).slice(0, 10);
		this.props.emojiSearchResultCount(emojis.length || 0);
		this.setState({ emojis });
	}

	render() {
		const { pickerOpen, insertEmoji } = this.props;
		const { emojis, highlightIndex } = this.state;

		return (
			<StyledEmojiPicker pickerOpen={pickerOpen && emojis?.length}>
				{pickerOpen && emojis?.length && emojis.map((emoji, index) => (
					<Emoji
						key={emoji.id}
						title={emoji.name}
						active={highlightIndex === index}
						onClick={() => insertEmoji(this.state.emojis[index])}
					>
						{emoji.native}
					</Emoji>
				))}
			</StyledEmojiPicker>
		);
	}
}

EmojiPicker.propTypes = {
	emojiQuery: PropTypes.string,
	pickerOpen: PropTypes.bool.isRequired,
	insertEmoji: PropTypes.func.isRequired,
	emojiSearchResultCount: PropTypes.func.isRequired,
};

EmojiPicker.defaultProps = {
	emojiQuery: "",
};
