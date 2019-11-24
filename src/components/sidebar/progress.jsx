import React from 'react';
import styled from "styled-components";
import ProgressBar from '../common/progressbar';

const ProgressContainer = styled.div `

`

export default class Progress extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			progressMonth: 23,
			progressYear: 11
		}
	}

	render() {
		return (
			<ProgressContainer>
				<span>{`Einträge im Oktober 2018: ${this.state.progressMonth}%`}</span>
				<ProgressBar progress={this.state.progressMonth} />

				<span>{`Einträge gesamt im Jahr 2018: ${this.state.progressYear}%`}</span>
				<ProgressBar progress={this.state.progressYear} />
			</ProgressContainer>
		);
	}
}
