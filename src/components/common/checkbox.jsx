import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledLabel = styled.label `
	display: block;
	position: relative;
	user-select: none;
	display: flex;
	align-items: center;
	color: ${props => (props.checked && "#00ff8b") || (props.disabled && "#aaa")};
	cursor: ${props => props.disabled ? "default" : "pointer"};
	font-size: 15px;
	transform-origin: left;
	transition: all 200ms;

	&:${props => !props.disabled && "hover"} {
		background-color: rgba(0, 0, 0, 0.2);

		svg, span {
			${props => !props.disabled && "transform: scale(1.15)"};
		}
	}

	&::after {
		content: "";
		position: relative;
		width: 20px;
		height: 20px;
		display: block;
		opacity: 0.6;
		margin-left: 10px;
		${props => !props.disabled && "border: 1px solid #6cc0e5;"};
		transition: all 200ms, border-color 100ms;

		${props => !props.checked} {
			width: 8px;
			top: -3px;
			left: -3px;
			opacity: 1;
			margin-left: 22px;
			border-radius: 0;
			border: 1px solid #6cc0e5;
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
	width: 10% !important;
	margin-right: 5px;
	transform-origin: left;
	transition: all 100ms;
`
const Text = styled.span `
	width: 25%;
	transform-origin: left;
	transition: all 100ms;
`

export default class Checkbox extends React.PureComponent {
	render() {
		return (
			<StyledLabel {...this.props}>
				<Icon icon={this.props.icon} />
				<Text>{this.props.label}</Text>
				<Input type="checkbox" checked={this.props.checked} {...this.props} /> 
			</StyledLabel>
		);
	}
}

Checkbox.propTypes = {
	label: PropTypes.any,
	checked: PropTypes.bool,
	disabled: PropTypes.bool,
	icon: PropTypes.object,
}
