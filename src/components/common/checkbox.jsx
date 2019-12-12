import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledLabel = styled.label `
	display: block;
	position: relative;
	user-select: none;
	display: flex;
	padding-left: 5px;
	align-items: center;
	${props => !props.disabled && "cursor: pointer"};
	font-size: 15px;
	transform-origin: left;
	transition: all 200ms;

	${props => props.checked && `
		color: #00ff8b;
	`}

	&:hover {
		${props => !props.disabled && "transform: scale(1.1)"};
		background-color: rgba(0, 0, 0, 0.2);
	}

	&::before {
		content: "";
		display: block;
		width: 20px;
		height: 20px;
		border: 1px solid #6cc0e5;
		margin-right: 10px;
		position: relative;
		left: 0;
		top: 0;
		opacity: 0.6;
		transition: all 200ms, border-color 100ms;

		${props => !props.checked} {
			width: 8px;
			top: -5px;
			left: 5px;
			opacity: 1;
			border-radius: 0;
			margin-right: 22px;
			border-top-color: transparent;
			border-left-color: transparent;
			transform: rotate(45deg);
		}
	}
`
const Input = styled.input `
	display: none;
`
const Icon = styled(FontAwesomeIcon) `
	margin-left: 10px;
`

export default class Checkbox extends React.PureComponent {
	render() {
		console.log(this.props.checked)
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
