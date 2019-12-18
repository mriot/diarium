import React from 'react';
import styled from 'styled-components';
import pose from "react-pose";
import PropTypes from 'prop-types';
import moment from 'moment';

const PosedFavoriteCard = pose.div();
const StyledFavoriteCard = styled(PosedFavoriteCard) `
	color: #222;
	display: flex;
	justify-content: space-between;
	background-color: rgba(255, 255, 255, 0.5);
`
const DateDisplay = styled.div `
	padding: 10px 20px;
	display: flex;
	justify-content: center;
	align-content: center;
	flex-direction: column;
	text-align: center;
	border-radius: 10px;
	background-color: #fff;

	div {
		font-size: 30px;
		font-weight: bold;
	}

	span {
		font-size: 14px;
	}
`
const Description = styled.div ``
const TagDisplay = styled.div ``

export default class FavoriteCard extends React.PureComponent {
	render() {
		return (
			<StyledFavoriteCard>
				<DateDisplay>
					<div>{moment(this.props.date).format("DD")}</div>
					<span>
						{moment(this.props.date).format("MMMM").substr(0, 3) + "."}
					</span>
				</DateDisplay>
				<Description>
					{/* {this.props.description} */}
				</Description>
				<TagDisplay>
					{/* {this.props.tags} */}
				</TagDisplay>
			</StyledFavoriteCard>
		);
	}
}

FavoriteCard.propTypes = {
	date: PropTypes.string.isRequired,
	description: PropTypes.string,
	tags: PropTypes.array,
}
