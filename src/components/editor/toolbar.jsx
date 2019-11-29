import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndoAlt, faRedoAlt, faColumns, faEye, faImage, faLink, faCode } from '@fortawesome/free-solid-svg-icons';

const StyledToolbar = styled.div `
	width: 100%;
	height: 40px;
	display: flex;
	justify-content: space-between;
	background-color: #efefef;
	font-size: 14px;
	padding: 1px 6px;
	border-bottom: 1px solid #ddd;
	user-select: none;
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	box-sizing: border-box;
`
const LeftSide = styled.aside `
	display: flex;
	align-items: center;
`
const RightSide = styled.aside `
	display: flex;
	align-items: center;
`
const IconButton = styled.div `
	padding: 6px 10px;
	line-height: 1;
	margin: 0 5px;
	cursor: pointer;
	border-radius: 3px;
	color: #1f222a;

	&:hover,
	&.active {
		background-color: #c7c7c7;
	}
`

export default class Toolbar extends React.PureComponent {
	render() {
		return (
			<StyledToolbar>
				<LeftSide>
					<IconButton>
						<FontAwesomeIcon icon={faUndoAlt} />
					</IconButton>
					<IconButton>
						<FontAwesomeIcon icon={faRedoAlt} />
					</IconButton>
					<IconButton>
						<FontAwesomeIcon icon={faImage} />
					</IconButton>
					<IconButton>
						<FontAwesomeIcon icon={faLink} />
					</IconButton>
					<IconButton>
						<FontAwesomeIcon icon={faCode} />
					</IconButton>
				</LeftSide>
				<RightSide>
					<IconButton>
						<FontAwesomeIcon icon={faEye} />
					</IconButton>
					<IconButton onClick={() => this.props.toggleColumns()}>
						<FontAwesomeIcon icon={faColumns} />
					</IconButton>
				</RightSide>
			</StyledToolbar>
		);
	}
}
