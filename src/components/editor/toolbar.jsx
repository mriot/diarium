import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndoAlt, faColumns, faImage, faLink, faCode, faExpand, faCompress, faShare, faReply } from '@fortawesome/free-solid-svg-icons';

const StyledToolbar = styled.div `
	width: 100%;
	height: 40px;
	display: flex;
	justify-content: space-between;
	background-color: #efefef;
	font-size: 14px;
	border-bottom: 1px solid #ddd;
	user-select: none;
	box-sizing: border-box;
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	${props => props.toolbarStatus.zenModeActive && `
		height: 35px;
		border-radius: 0;
		border-bottom: none;
	`}
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
			<StyledToolbar {...this.props}>
				<LeftSide>

					<IconButton title="Rückgängig" onClick={() => this.props.editorUndo()}>
						<FontAwesomeIcon icon={faReply} />
					</IconButton>

					<IconButton title="Wiederholen" onClick={() => this.props.editorRedo()}>
						<FontAwesomeIcon icon={faShare} />
					</IconButton>

					<IconButton title="Bild einfügen">
						<FontAwesomeIcon icon={faImage} />
					</IconButton>

					<IconButton
						title="Link einfügen"
						onClick={() => this.props.insertLink()}
					>
						<FontAwesomeIcon icon={faLink} />
					</IconButton>

					<IconButton
						title="Code einfügen"
						onClick={() => this.props.insertCode()}
					>
						<FontAwesomeIcon icon={faCode} />
					</IconButton>

				</LeftSide>
				<RightSide>

					<IconButton
						title="Zen-Mode"
						onClick={() => this.props.toggleZenMode()}
						className={this.props.toolbarStatus.zenModeActive ? "active" : ""}
					>
						<FontAwesomeIcon icon={this.props.toolbarStatus.zenModeActive ? faCompress : faExpand} />
					</IconButton>

					<IconButton
						title="Ansicht splitten"
						onClick={() => this.props.togglePreview()}
						className={this.props.toolbarStatus.previewActive ? "active" : ""}
					>
						<FontAwesomeIcon icon={faColumns} />
					</IconButton>

					<IconButton
						title="Layout zurücksetzen"
						onClick={() => this.props.resetLayout()}
					>
						<FontAwesomeIcon icon={faUndoAlt} />
					</IconButton>
					
				</RightSide>
			</StyledToolbar>
		);
	}
}
