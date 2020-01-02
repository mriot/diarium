import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ProgressBar from "../common/progressbar";

const ProgressContainer = styled.div `
	padding: 0 0 5px 5px;
	border-bottom: 1px solid #191919;
	box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`;
const ProgressDescription = styled.div `
	color: #efefef;
	font-size: 15px;
	font-weight: 100;
	margin: 15px 0 5px;
`;
const TotalDescription = styled(ProgressDescription) `
	margin: 20px 0 0;
`;

export default class Progress extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			progressWeek: 45,
			progressMonth: 15,
			progressYear: 11,
			progressTotal: 123,
		};
	}

	render() {
		return (
			<ProgressContainer>
				<ProgressDescription>
					Einträge diese Woche: {this.state.progressWeek}%
				</ProgressDescription>
				<ProgressBar progress={this.state.progressWeek} />

				<ProgressDescription>
					Einträge im November: {this.state.progressMonth}%
				</ProgressDescription>
				<ProgressBar progress={this.state.progressMonth} />

				<ProgressDescription>
					Einträge im aktuellen Jahr: {this.state.progressYear}%
				</ProgressDescription>
				<ProgressBar progress={this.state.progressYear} />

				<TotalDescription>
					Einträge gesamt: {this.state.progressTotal}
				</TotalDescription>
			</ProgressContainer>
		);
	}
}

// as this component is still WIP, I'll leave it like this for now.
Progress.propTypes = {};
