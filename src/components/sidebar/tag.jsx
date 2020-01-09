import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StyledTag = styled.div `
	display: block;
	position: relative;
	user-select: none;
	display: flex;
	align-items: center;
	line-height: 2;
	color: ${props => (props.checked && "#00ff8b") || (props.disabled && "#aaa")};
	cursor: ${props => (props.disabled ? "default" : "pointer")};
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
`;
const Icon = styled(FontAwesomeIcon) `
	width: 10% !important;
	margin-right: 5px;
	transform-origin: left;
	transition: all 100ms;
`;
const Text = styled.span `
	width: 25%;
	transform-origin: left;
	transition: all 100ms;
`;

export default class Tag extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.state = {
			isChecked: false,
		};
	}

	componentDidMount() {
		this.setState({ isChecked: this.props.defaultChecked });
	}
	
	componentDidUpdate(prevProps, prevState) {
		if (prevProps.defaultChecked !== this.props.defaultChecked) {
			this.setState({ isChecked: this.props.defaultChecked });
		}
	}

	render() {
		const { label, icon, value, disabled, addToSelectedTags, removeFromSelectedTags } = this.props;

		return (
			<StyledTag
				label={label}
				icon={icon}
				value={value} // that's the value we gonna write into the selectedTags array
				disabled={disabled}
				checked={this.state.isChecked}
				onClick={() => {
					if (!this.state.isChecked) {
						addToSelectedTags(value);
						this.setState({ isChecked: true });
					} else {
						removeFromSelectedTags(value);
						this.setState({ isChecked: false });
					}
				}}
			>
				<Icon icon={this.props.icon} />
				<Text>{this.props.label}</Text>
			</StyledTag>
		);
	}
}

Tag.propTypes = {
	value: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	icon: PropTypes.object,
	disabled: PropTypes.bool,
	defaultChecked: PropTypes.bool.isRequired,
	addToSelectedTags: PropTypes.func.isRequired,
	removeFromSelectedTags: PropTypes.func.isRequired,
};
