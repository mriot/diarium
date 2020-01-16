import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ProgressContainer = styled.div `
	width: 95%;
	height: 10px;
	background: grey;
	position: relative;
	overflow: hidden;
	border-radius: 10px;
`;

const ProgressFilling = styled.div `
	position: absolute;
	width: ${props => props.progress}%;
	height: 100%;
	background-color: #00b7ff;
	transition: all 500ms;
`;

export default class ProgressBar extends React.PureComponent {
	render() {
		return (
			<ProgressContainer>
				<ProgressFilling progress={this.props.progress} />
			</ProgressContainer>
		);
	}
}

ProgressBar.propTypes = {
	progress: PropTypes.number.isRequired,
};
