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
				<TextInput onChange={event => {
					this.setState({
						emojis: emojiIndex.search(event.currentTarget.value).map(o => (
							<span className="emoji">{o.native}</span>
						)),
					});
				}}
				/>
				<EmojiPreviewContainer>
					{this.state.emojis}
				</EmojiPreviewContainer>
			</StyledEmojiPicker>
		);
	}
}

EmojiPicker.propTypes = {
	
};

EmojiPicker.defaultProps = {
	
};
