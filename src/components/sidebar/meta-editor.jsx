import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Checkbox from '../common/checkbox';
import { faStar, faMapMarkerAlt, faBiohazard, faLock } from '@fortawesome/free-solid-svg-icons';

const MetaEditorContainer = styled.div `
	color: #fff;
	width: 100%;
	flex: 1;
	padding: 15px 0;
	box-sizing: border-box;
	border-bottom: 1px solid #191919;
	box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`
const Heading = styled.h3 `
	margin: 0 0 10px;
	padding-left: 5px;
	padding-bottom: 10px;
	border-bottom: 1px solid #191919;
`
const MetaFields = styled.div ` 
	display: flex;
	flex-direction: column;

	${Checkbox} {
		line-height: 2;
	}
`

export default class MetaEditor extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.state = {
			favorite: true,
			vacation: false,
			sickness: false,
			nsfw: false,
		}
	}

	handleCheckboxClick(stuff) {
		console.log(stuff)
	}

	render() {
		return (
			<MetaEditorContainer>
				<Heading>Labels</Heading>
				<MetaFields>
					<Checkbox label="Favorit" icon={faStar} 
						checked={this.state.favorite}
						onChange={() => this.setState({favorite: !this.state.favorite})}
					/>
					<Checkbox label="Urlaub" icon={faMapMarkerAlt}
						checked={this.state.vacation}
						onChange={() => this.setState({vacation: !this.state.vacation})}
					/>
					<Checkbox label="Krank" icon={faBiohazard}
						checked={this.state.sickness}
						onChange={() => this.setState({sickness: !this.state.sickness})}
					/>
					<Checkbox label="NSFW" icon={faLock}
						checked={this.state.nsfw}
						onChange={() => this.setState({nsfw: !this.state.nsfw})}
					/>
				</MetaFields>
			</MetaEditorContainer>
		);
	}
}

MetaEditor.propTypes = {
	
}
