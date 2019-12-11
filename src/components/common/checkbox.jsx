import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledLabel = styled.label `
	display: block;
	user-select: none;
	display: flex;
	padding-left: 5px;
	align-items: center;
	cursor: pointer;
	font-size: 15px;
	transform-origin: left;
	transition: all 200ms;

	${props => props.checked && `
		color: #00ff8b;
	`}

	&:hover {
		transform: scale(1.1);
		background-color: rgba(0, 0, 0, 0.2)
	}
`
const Input = styled.input `
	margin-right: 10px;
`
const Icon = styled(FontAwesomeIcon) `
	margin-left: 10px;
`

export default class Checkbox extends React.PureComponent {
	render() {
		return (
			<StyledLabel {...this.props}>
				<Input type="checkbox" checked={this.props.checked} {...this.props} /> {this.props.label} 
				<Icon icon={this.props.icon} />
			</StyledLabel>
		);
	}
}

Checkbox.propTypes = {
	value: PropTypes.any,
}
