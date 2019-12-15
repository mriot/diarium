import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import posed from 'react-pose';

const animation = {
	enter: {
		opacity: 1,
		scaleX: 1,
		transition: {
			duration: 300,
			ease: "anticipate",
		},
	},
	exit: {
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
	transform-origin: left;
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
