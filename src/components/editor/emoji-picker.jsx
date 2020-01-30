import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { emojiIndex } from "emoji-mart";
import TextInput from "../common/textinput";

const StyledEmojiPicker = styled.div `
	position: absolute;
	display: flex;
	flex-wrap: wrap;
	/* width: 75%;
	height: 50px; */
	background-color: #333;
	z-index: 9999;
`;
const StyledTextInput = styled(TextInput) `
	width: 100%;
`;
const EmojiPreviewContainer = styled.div `

`;

export default class EmojiPicker extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.state = {
			emojis: null,
		};
	}

	render() {
		return (
			<StyledEmojiPicker>
				<EmojiPreviewContainer>
					{
						emojiIndex.search(this.props.emojiQuery || "sad").map(o => {
							return <span className="emoji" key={o.id}>{o.native}</span>;
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
	emojiQuery: "sad",
};
