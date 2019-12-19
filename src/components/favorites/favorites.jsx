import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import posed from 'react-pose';
import { favoritesAnimation } from "./animations";
import FavoriteCard from './favorite-card';
import moment from 'moment';
import YearAccordion from './YearAccordion';
import uuid4 from "uuid/v4";

const PosedFavoritesContainer = posed.div(favoritesAnimation);
const FavoritesContainer = styled(PosedFavoritesContainer) `
	width: 100%;
	height: 100%;
	color: #fff;
	position: relative;
	z-index: 1; /* place on top of editor */
	display: grid;
	gap: 5px;
	grid-auto-rows: auto;
	grid-template-columns: repeat(2, 1fr);
	align-content: baseline;
	background-color: #191919;
	transform-origin: center;
	backface-visibility: hidden;
`

export default class Favorites extends React.PureComponent {
	render() {
		return (
			<FavoritesContainer {...this.props}>
				<YearAccordion year={2020}>
					<FavoriteCard key={uuid4()} date={moment().add(1, "day")} tags={["lorem", "ipsum"]} desc={"My first favorite!"} />
					<FavoriteCard key={uuid4()} date={moment().add(1, "day")} tags={["lorem", "ipsum"]} desc={"My first favorite!"} />
				</YearAccordion>
				<YearAccordion year={2019}>
					<FavoriteCard key={uuid4()} date={moment()} tags={["lorem", "ipsum"]} desc={"My first favorite!"} />
					<FavoriteCard key={uuid4()} date={moment()} tags={["lorem", "ipsum"]} />
					<FavoriteCard key={uuid4()} date={moment()} tags={["lorem", "ipsum"]} desc={"My first favorite!"} />
					<FavoriteCard key={uuid4()} date={moment()} tags={["lorem", "ipsum"]} desc={"My first favorite!"} />
				</YearAccordion>
				<YearAccordion year={2018}>
					<FavoriteCard key={uuid4()} date={moment()} tags={["lorem", "ipsum"]} desc={"My first favorite!"} />
				</YearAccordion>
			</FavoritesContainer>
		);
	}
}

Favorites.propTypes = {
	_pose: PropTypes.any,

}
