import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import posed from 'react-pose';
import { favoritesAnimation } from "./animations";
import FavoriteCard from './favorite-card';
import moment from 'moment';

const PosedFavoritesContainer = posed.div(favoritesAnimation);
const FavoritesContainer = styled(PosedFavoritesContainer) `
	width: 100%;
	height: 100%;
	color: #fff;
	position: relative;
	z-index: 1; /* place on top of editor */
	display: grid;
	grid-template-rows: repeat(auto, fit-content);
	grid-template-columns: repeat(3, 1fr);
	gap: 10px;
	background-color: #191919;
	transform-origin: center;
	backface-visibility: hidden;
`

export default class Favorites extends React.PureComponent {
	render() {
		return (
			<FavoritesContainer {...this.props}>
				<FavoriteCard date={moment()} tags={["lorem", "ipsum"]} desc={"My first favorite!"} />
				<FavoriteCard date={moment()} tags={["lorem", "ipsum"]} desc={"My first favorite!"} />
				<FavoriteCard date={moment()} tags={["lorem", "ipsum"]} desc={"My first favorite!"} />
				<FavoriteCard date={moment()} tags={["lorem", "ipsum"]} desc={"My first favorite!"} />
				<FavoriteCard date={moment()} tags={["lorem", "ipsum"]} desc={"My first favorite!"} />
				<FavoriteCard date={moment()} tags={["lorem", "ipsum"]} desc={"My first favorite!"} />
			</FavoritesContainer>
		);
	}
}

Favorites.propTypes = {
	_pose: PropTypes.any,

}
