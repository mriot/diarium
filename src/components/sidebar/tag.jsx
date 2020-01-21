import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StyledTag = styled.div `
	position: relative;
	user-select: none;
	align-items: center;
	line-height: 2;
	color: ${props => (props.checked && "#00ff8b") || (props.disabled && "#aaa")};
	cursor: ${props => (props.disabled ? "default" : "pointer")};
	border-radius: 50px;
	font-size: 15px;
	transform-origin: left;
	padding: 0 5px;
	transition: all 100ms;

	&:${props => !props.disabled && "hover"} {
		background-color: rgba(0, 0, 0, 0.2);

		span, svg {
			transform: scale(1.15);
		}
	}
`;
const Icon = styled(FontAwesomeIcon) `
	width: 15% !important;
	margin-right: 7px;
	transform-origin: left;
	transition: all 100ms;
`;
const Text = styled.span `
	display: inline-block;
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
					if (disabled) return;
					
					if (!this.state.isChecked) {
						addToSelectedTags(value);
					} else {
						removeFromSelectedTags(value);
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
	icon: PropTypes.object.isRequired,
	disabled: PropTypes.bool,
	defaultChecked: PropTypes.bool.isRequired,
	addToSelectedTags: PropTypes.func.isRequired,
	removeFromSelectedTags: PropTypes.func.isRequired,
};

Tag.defaultProps = {
	disabled: false,
};
