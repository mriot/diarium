import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import posed, { PoseGroup } from 'react-pose';
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
	constructor(props) {
		super(props);
		
		this.state = {
			ready: false,
			accordionOpen: false,
		}
	}
	
	toggleAccordion() {
		this.setState({accordionOpen: !this.state.accordionOpen})
	}
	
	render() {
		const cards = [
			{
				date: moment("2010-12-12"),
				desc: "Hello World",
				tags: ["lorem", "ipsum"]
			},
			{
				date: moment("2010-11-11"),
				desc: "Hello World 2",
				tags: ["lorem", "ipsum"]
			},
			{
				date: moment("2010-08-08"),
				desc: "Hello World 3",
				tags: ["lorem", "ipsum"]
			},
			{
				date: moment("2010-01-01"),
				tags: ["lorem", "ipsum"]
			},
		];

		return (
			<FavoritesContainer {...this.props}>
				<YearAccordion year={2020}
					toggleAccordion={() => this.toggleAccordion()}
					accordionOpen={this.state.accordionOpen}
				>
						{cards.map((item, index) => 
							<FavoriteCard
								key={index}
								index={index}
								date={item.date}
								tags={item.tags} 
								desc={item.desc} 
								pose={this.state.accordionOpen ? "show" : "hide"}
							/>
						)}
				</YearAccordion>
			</FavoritesContainer>
		);
	}
}

Favorites.propTypes = {
	_pose: PropTypes.any,

}
