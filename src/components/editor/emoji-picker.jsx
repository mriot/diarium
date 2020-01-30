import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { emojiIndex } from "emoji-mart";

const StyledEmojiPicker = styled.div `
	position: absolute;
	display: flex;
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
		/* active: box-shadow: 0 0 0 2px rgba(0,165,244,.4); */
	}
`;

export default class EmojiPicker extends React.PureComponent {
	render() {
		return (
			<StyledEmojiPicker>
				<EmojiPreviewContainer>
					{
						emojiIndex.search(this.props.emojiQuery).map(emoji => {
							return <span className="emoji" key={emoji.id}>{emoji.native}</span>;
						})
					}
				</EmojiPreviewContainer>
			</StyledEmojiPicker>
		);
	}
}

EmojiPicker.propTypes = {
	emojiQuery: PropTypes.string,
};

EmojiPicker.defaultProps = {
	emojiQuery: "",
};
