import React from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import PropTypes from 'prop-types';
import moment from 'moment';
import { highlightCardAnimation } from './animations';

const PosedHighlightCard = posed.div(highlightCardAnimation);
const StyledHighlightCard = styled(PosedHighlightCard) `
	color: #222;
	display: flex;
	align-items: center;
	margin-top: 5px;
	border-radius: 10px;
	transform-origin: top;
	cursor: pointer;
	background-color: rgba(255, 255, 255, 0.9);
	transition: background-color 0.2s;

	&:hover {
		background-color: rgb(255, 255, 255);
	}
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

export default class HighlightCard extends React.PureComponent {
	render() {
		return (
			<StyledHighlightCard {...this.props}>
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
			</StyledHighlightCard>
		);
	}
}

HighlightCard.defaultProps = {
	desc: "Keine Beschreibung... 🙉",
}

HighlightCard.propTypes = {
	date: PropTypes.objectOf(moment).isRequired,
	desc: PropTypes.string,
	tags: PropTypes.array,
}
