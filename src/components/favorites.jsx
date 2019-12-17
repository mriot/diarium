import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import posed from 'react-pose';
import { favoritesAnimation } from "./animations";

const PosedFavoritesContainer = posed.div(favoritesAnimation);
const FavoritesContainer = styled(PosedFavoritesContainer) `
	display: flex;
	width: 100%;
	height: 100%;
	color: #fff;
	position: relative;
	flex-direction: column;
	background-color: #191919;
	transform-origin: center;
	backface-visibility: hidden;
`

export default class Favorites extends React.PureComponent {
	render() {
		return (
			<FavoritesContainer pose={this.props.pose} {...this.props}>
				LOREM IPSUM {this.props.pose}
			</FavoritesContainer>
		);
	}
}

Favorites.propTypes = {
	
}
