import React from 'react';
import styled from 'styled-components';
import pose, { PoseGroup } from "react-pose";
import PropTypes from 'prop-types';
import { accordionAnimation } from './animations';

const StyledYearAccordion = styled.div `
	display: flex;
	flex-direction: column;
`
const Header = styled.div `
	font-size: 20px;
	padding: 10px 15px;
	cursor: pointer;
	border-radius: 10px;
	background-color: darkred;
`
const PosedBody = pose.div(accordionAnimation);
const Body = styled(PosedBody) `
	display: flex;
	flex-direction: column;
`

export default class YearAccordion extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.state = {
			accordionOpen: false,
		}
	}

	toggleAccordion() {
		this.setState({accordionOpen: !this.state.accordionOpen})
	}

	render() {
		return (
			<StyledYearAccordion onClick={() => this.toggleAccordion()}>
				<Header>{this.props.year}</Header>
				<Body>
					<PoseGroup>
						{this.props.children}
					</PoseGroup>
				</Body>
			</StyledYearAccordion>
		);
	}
}

YearAccordion.propTypes = {
	year: PropTypes.string.isRequired,

}
