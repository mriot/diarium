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
	position: relative;
	flex-direction: column;
	transform-origin: right;
	background-color: darkred;
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
