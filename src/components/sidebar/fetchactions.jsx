import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const FetchAction = styled.div `
	display: flex;
	background-color: #333;
	padding: 5px 10px;
	color: ${props => props.active ? "lime" : "red"};
`
const rotate = keyframes `
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`
const FetchIcon = styled(FontAwesomeIcon) `
	margin-right: 5px;
	animation: ${rotate} 1s linear infinite;
`

export default class FetchActions extends React.PureComponent {
	render() {
		return (
			<FetchAction active={this.props.active}>
				<FetchIcon icon={faCog} />
				<span>Loading image...</span>
			</FetchAction>
		);
	}
}
