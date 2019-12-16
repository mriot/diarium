import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import posed from 'react-pose';

const animation = {
	enter: {
		opacity: 1,
		scaleX: 1,
		applyAtStart: {position: "absolute"},
		applyAtEnd: {position: "relative"},
		transition: {
			delay: 700,
			duration: 1000,
			ease: "anticipate",
		},
	},
	exit: {
		applyAtStart: {position: "absolute"},
		applyAtEnd: {position: "relative"},
		transition: {
			duration: 1000,
			ease: "anticipate",
		},
		opacity: 0,
		scaleX: 0
	},
}

const PosedDiv = posed.div(animation);
const FavoritesContainer = styled(PosedDiv) `
	display: flex;
	width: 100%;
	max-height: 100%;
	overflow: hidden;
	position: relative;
	flex-direction: column;
	background-color: red;
	transform-origin: right;
`


export default class Favorites extends React.PureComponent {
	render() {
		return (
			<FavoritesContainer pose={this.props.pose} {...this.props}>
				LOREM IPSUM
			</FavoritesContainer>
		);
	}
}

Favorites.propTypes = {
	
}
