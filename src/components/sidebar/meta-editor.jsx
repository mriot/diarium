import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { faMapMarkerAlt, faBiohazard, faLock, faTheaterMasks } from "@fortawesome/free-solid-svg-icons";
import Checkbox from "../common/checkbox";

const MetaEditorContainer = styled.div `
	color: #fff;
	width: 100%;
	flex: 1;
	padding: 15px 0;
	box-sizing: border-box;
	border-bottom: 1px solid #191919;
	box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`;
const Heading = styled.h3 `
	margin: 0 0 10px;
	padding-left: 5px;
	padding-bottom: 10px;
	border-bottom: 1px solid #191919;
`;
const MetaFields = styled.div ` 
	display: flex;
	flex-direction: column;

	${Checkbox} {
		line-height: 2;
	}
`;

export default class MetaEditor extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.state = {
			highlight: false,
			vacation: false,
			sick: false,
			nsfw: false,
			checkboxDisabled: this.props.isReadModeActive,
		};
	}

	componentDidMount() {
		const { highlight = false, vacation = false, sick = false, nsfw = false } = this.props.tags;
		this.setState({ highlight, vacation, sick, nsfw, });
	}

	componentDidUpdate(prevProps, prevState) {
		const { highlight = false, vacation = false, sick = false, nsfw = false } = this.props.tags;
		this.setState({ highlight, vacation, sick, nsfw, });

		if (prevProps.isReadModeActive !== this.props.isReadModeActive) {
			this.setState({ checkboxDisabled: this.props.isReadModeActive });
		}
	}
	
	handleCheckboxClick(stuff) {
		console.log(this, stuff);
	}

	render() {
		return (
			<MetaEditorContainer>
				<Heading>Tags</Heading>
				<MetaFields>
					<Checkbox label="Highlight" icon={faTheaterMasks}
						disabled={this.state.checkboxDisabled}
						checked={this.state.highlight}
						onChange={() => this.setState(prevState => ({ highlight: !prevState.highlight }))}
					/>
					<Checkbox label="Urlaub" icon={faMapMarkerAlt}
						disabled={this.state.checkboxDisabled}
						checked={this.state.vacation}
						onChange={() => this.setState(prevState => ({ vacation: !prevState.vacation }))}
					/>
					<Checkbox label="Krank" icon={faBiohazard}
						disabled={this.state.checkboxDisabled}
						checked={this.state.sick}
						onChange={() => this.setState(prevState => ({ sick: !prevState.sick }))}
					/>
					<Checkbox label="NSFW" icon={faLock}
						disabled={this.state.checkboxDisabled}
						checked={this.state.nsfw}
						onChange={() => this.setState(prevState => ({ nsfw: !prevState.nsfw }))}
					/>
				</MetaFields>
			</MetaEditorContainer>
		);
	}
}

MetaEditor.propTypes = {
	isReadModeActive: PropTypes.bool.isRequired,
	// tags: PropTypes.array,
};
