import React from 'react';
import styled from "styled-components";

const ProgressContainer = styled.div `
	width: 100%;
	height: 30px;
	background: grey;
	position: relative;
	overflow: hidden;
	border-radius: 10px;
`

const ProgressFilling = styled.div `
	width: ${props => props.progress}%;
	height: 100%;
	background: green;
	position: absolute;
	/* border-radius: 10px; */
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
