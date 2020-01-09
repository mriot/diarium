import React from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";

const box1 = keyframes `
	0% {
    left:-35%;
    right:100%;
  }
  60%,100% {
    left:100%;
    right:-90%;
  }
`;
const box2 = keyframes `
	0% {
    left:-200%;
    right:100%;
  }
  60%,100% {
    left:107%;
    right:-8%;
  }
`;

const StyledLoadingbar = styled.div `
	position: relative;
	width: 100%;
	height: 3px;
	opacity: ${props => (props.active ? 1 : 0)};
	/* background-color: #000; */

	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		background-color: #4e819a;
		animation: ${box1} 2s cubic-bezier(0.65, 0.81, 0.73, 0.4) infinite;
	}

	&::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		background-color: #4e819a;
		animation: ${box2} 2s cubic-bezier(0.16, 0.84, 0.44, 1) infinite;
		animation-delay: 1.1s;
	}
	/* https://codepen.io/inertia/pen/oeQKXW */
`;

export default class Loadingbar extends React.PureComponent {
	render() {
		return (
			<StyledLoadingbar active={this.props.active} />
		);
	}
}

Loadingbar.propTypes = {
	active: PropTypes.bool,
};

Loadingbar.defaultProps = {
	active: false,
};
