import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndoAlt, faColumns, faImage, faLink, faCode, faExpand, faCompress, faShare, faReply, faVihara, faPaperclip, faArrowsAltH } from '@fortawesome/free-solid-svg-icons';

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
const ButtonSeparator = styled.div `
	width: 2px;
	height: 60%;
	margin: 0 5px;
	background-color: #c7c7c7;
`
const IconButton = styled.div `
	padding: 6px 10px;
	line-height: 1;
	margin: 0 5px;
	cursor: pointer;
	border-radius: 3px;
	color: #1f222a;

	&:hover {
		background-color: #c7c7c7;
	}

	${props => props.isActive && `
		background-color: #c7c7c7;
	`}
`

export default class Toolbar extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.state = {
			inFullscreenMode: false,
		}
	}

	toggleFullScreen() {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().then(
				this.setState({inFullscreenMode: true})
			)
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen().then(
					this.setState({inFullscreenMode: false})
				)
			}
		}
	}

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

					<ButtonSeparator />

					<IconButton
						title="Scrollen synchronisieren"
						onClick={() => this.props.toggleScrollSync()}
						isActive={this.props.toolbarStatus.scrollSyncActive}
					>
						<FontAwesomeIcon icon={faArrowsAltH} />
					</IconButton>
				</LeftSide>

				<RightSide>
					<IconButton
						title="Zen-Mode"
						onClick={() => this.props.toggleZenMode()}
						isActive={this.props.toolbarStatus.zenModeActive}
					>
						<FontAwesomeIcon icon={faVihara} />
					</IconButton>

					<IconButton
						title="Ansicht splitten"
						onClick={() => this.props.togglePreview()}
						isActive={this.props.toolbarStatus.previewActive}
					>
						<FontAwesomeIcon icon={faColumns} />
					</IconButton>

					<IconButton
						title="Vollbild"
						onClick={() => {
							this.toggleFullScreen();
							this.props.editorFocus();
						}}
						isActive={this.state.inFullscreenMode}
					>
						<FontAwesomeIcon icon={this.state.inFullscreenMode ? faCompress : faExpand} />
					</IconButton>

					<IconButton
						title="Layout des Editors zurücksetzen"
						onClick={() => {
							this.props.resetLayout();
							this.state.inFullscreenMode && this.toggleFullScreen();
						}}
					>
						<FontAwesomeIcon icon={faUndoAlt} />
					</IconButton>
				</RightSide>
			</StyledToolbar>
		);
	}
}
