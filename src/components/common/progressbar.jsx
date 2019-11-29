import React from 'react';
import styled from "styled-components";

const ProgressContainer = styled.div `
	width: 95%;
	height: 15px;
	background: grey;
	position: relative;
	overflow: hidden;
	border-radius: 10px;
`

const ProgressFilling = styled.div `
	position: absolute;
	width: ${props => props.progress}%;
	height: 100%;
	background-color: #61dafb;
`

export default class ProgressBar extends React.PureComponent {
	render() {
		return (
			<ProgressContainer>
				<ProgressFilling progress={this.props.progress} />
			</ProgressContainer>
		);
	}
}
