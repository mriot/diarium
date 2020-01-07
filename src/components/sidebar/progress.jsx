import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";
import ProgressBar from "../common/progressbar";
import { countAllEntries, countRecordsInRange } from "../../lib/backend";

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
			progressWeek: 0,
			progressMonth: 0,
			progressYear: 0,
			progressTotal: 0,
		};
	}

	componentDidMount() {
		this.countAllEntries();
		this.countRecordsInRange(
			moment().startOf("month").format("YYYY-MM-DD"),
			moment().add(1, "month").format("YYYY-MM-DD"),
			"progressMonth"
		);
		this.countRecordsInRange(
			moment().startOf("year").format("YYYY-MM-DD"),
			moment().add(1, "year").format("YYYY-MM-DD"),
			"progressYear"
		);
	}
	
	countAllEntries() {
		countAllEntries().then(response => {
			this.setState({ progressTotal: response.all_records });
		});
	}

	countRecordsInRange(start, end, stateKey) {
		countRecordsInRange(start, end).then(response => {
			this.setState({ [stateKey]: response.records_in_range });
		});
	}

	render() {
		return (
			<ProgressContainer>
				{/* <ProgressDescription>
					Einträge diese Woche: {this.state.progressWeek}%
				</ProgressDescription>
				<ProgressBar progress={this.state.progressWeek} /> */}

				<ProgressDescription>
					Einträge im {moment().format("MMMM")}: {this.state.progressMonth}
				</ProgressDescription>
				<ProgressBar progress={this.state.progressMonth} />

				<ProgressDescription>
					Einträge im Jahr {moment().year()}: {(this.state.progressYear / 365).toFixed(2)}%
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
