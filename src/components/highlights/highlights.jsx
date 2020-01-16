import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import posed from "react-pose";
import moment from "moment";
import { highlightsAnimation } from "./animations";
import HighlightCard from "./highlight-card";
import YearAccordion from "./YearAccordion";

const PosedHighlightsContainer = posed.div(highlightsAnimation);
const HighlightsContainer = styled(PosedHighlightsContainer) `
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
`;

export default class Highlights extends React.PureComponent {
	render() {
		const cards = [
			{
				date: moment("2010-12-12"),
				desc: "Hello World",
				tags: ["lorem", "ipsum"],
			},
			{
				date: moment("2010-11-11"),
				desc: "Hello World 2",
				tags: ["lorem", "ipsum"],
			},
			{
				date: moment("2010-08-08"),
				desc: "Hello World 3",
				tags: ["lorem", "ipsum"],
			},
			{
				date: moment("2010-01-01"),
				tags: ["lorem", "ipsum"],
			},
		];

		return (
			<HighlightsContainer {...this.props}>
				<YearAccordion year={2021} render={accordionOpen => (
					cards.map((item, index) => (
						<HighlightCard
							key={index}
							index={index}
							date={item.date}
							tags={item.tags}
							desc={item.desc}
							pose={accordionOpen ? "show" : "hide"}
						/>
					))
				)}
				/>

				<YearAccordion year={2020} render={accordionOpen => (
					cards.map((item, index) => (
						<HighlightCard
							key={index}
							index={index}
							date={item.date}
							tags={item.tags}
							desc={item.desc}
							pose={accordionOpen ? "show" : "hide"}
						/>
					))
				)}
				/>

				<YearAccordion year={2019} render={accordionOpen => (
					cards.map((item, index) => (
						<HighlightCard
							key={index}
							index={index}
							date={item.date}
							tags={item.tags}
							desc={item.desc}
							pose={accordionOpen ? "show" : "hide"}
						/>
					))
				)}
				/>
			</HighlightsContainer>
		);
	}
}

Highlights.propTypes = {
	_pose: PropTypes.any.isRequired,
};
