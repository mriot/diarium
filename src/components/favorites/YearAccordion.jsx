import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';

const StyledYearAccordion = styled.div `
	display: flex;
	flex-direction: column;
`
const Header = styled.div `
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 20px;
	padding: 10px 15px;
	cursor: pointer;
	border-radius: 10px;
	background-color: #607d8b;
`
const Body = styled.div `
	display: flex;
	flex-direction: column;
`
const Icon = styled(FontAwesomeIcon) `
	transition: all 0.3s;

	${props => props.open && `
		transform: rotateX(180deg)
	`}
`

export default class YearAccordion extends React.PureComponent {
	render() {
		return (
			<StyledYearAccordion>
				<Header onClick={() => this.props.toggleAccordion()}>
					{this.props.year}
					<Icon icon={faCaretUp} open={this.props.accordionOpen} />
				</Header>
				<Body>
					{this.props.children}
				</Body>
			</StyledYearAccordion>
		);
	}
}

YearAccordion.propTypes = {
	year: PropTypes.number.isRequired,
	toggleAccordion: PropTypes.func.isRequired,
	accordionOpen: PropTypes.bool.isRequired,
	children: PropTypes.array,
}
