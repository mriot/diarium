import React from 'react';
import styled from 'styled-components';
import pose from "react-pose";
import PropTypes from 'prop-types';
import moment from 'moment';
import { favoriteCardAnimation } from './animations';

const PosedFavoriteCard = pose.div(favoriteCardAnimation);
const StyledFavoriteCard = styled(PosedFavoriteCard) `
	color: #222;
	display: flex;
	align-items: center;
	border-radius: 10px;
	background-color: rgba(255, 255, 255, 0.9);
`
const DateDisplay = styled.div `
	padding: 10px 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	text-align: center;
	border-radius: 10px 0 0 10px;
	background-color: #fff;

	div {
		font-size: 30px;
		font-weight: bold;
	}

	span {
		font-size: 14px;
	}
`
const CardBody = styled.div `
	display: flex;
	flex-direction: column;
	margin-left: 10px;
`
const Desc = styled.div `

`
const Tags = styled.div `

`

export default class FavoriteCard extends React.PureComponent {
	render() {
		return (
			<StyledFavoriteCard>
				<DateDisplay>
					<div>{moment(this.props.date).format("DD")}</div>
					<span>
						{moment(this.props.date).format("MMMM").substr(0, 3)}
					</span>
				</DateDisplay>
				<CardBody>
					<Desc>{this.props.desc}</Desc>
					<Tags>{this.props.tags}</Tags>
				</CardBody>
			</StyledFavoriteCard>
		);
	}
}

FavoriteCard.defaultProps = {
	desc: "Keine Beschreibung... 🙉",
}

FavoriteCard.propTypes = {
	date: PropTypes.objectOf(moment).isRequired,
	desc: PropTypes.string,
	tags: PropTypes.array,
}
