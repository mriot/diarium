import React from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';
import uuid4 from "uuid/v4";
import { AnimateKeyframes } from "react-simple-animate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndoAlt, faColumns, faImage, faLink, faCode, faExpand, faCompress, faShare, faReply, faVihara, faPaperclip, faArrowsAltH, faAnchor } from '@fortawesome/free-solid-svg-icons';

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
	height: 20px;
	margin: 0 5px;
	background-color: #c7c7c7;
`
const IconButton = styled.div `
	position: relative;
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

	${props => props.isDisabled && `
		color: #777;
		pointer-events: none;
	`}

/*
	&::before {
		content: "${props => props.displayCounter > 0 && props.displayCounter}";
		position: absolute;
		top: 0;
		right: 0;
		font-size: 11px;
		opacity: 0.5;
	}
*/
`

export default class Toolbar extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.state = {
			inFullscreenMode: false,
			visible: true,
		}
		
		this.toolbarItems = {
			left: [
				{
					title: "Rückgängig",
					onClick: () => this.props.editorUndo(),
					isDisabled: this.props.toolbarStatus.editorHistory.undo <= 0,
					icon: faReply,
				}, {
					title: "Wiederholen",
					onClick: () => this.props.editorRedo(),
					isDisabled: this.props.toolbarStatus.editorHistory.redo <= 0,
					icon: faShare,
				}, {
					title: "Bild einfügen",
					onClick: null,
					icon: faImage,
				}, {
					title: "Link einfügen",
					onClick: () => this.props.insertLink(),
					icon: faLink,
				}, {
					title: "Code einfügen",
					onClick: () => this.props.insertCode(),
					icon: faCode,
				}, {
					separator: true,
				}, {
					title: "Scrollen synchronisieren",
					onClick: () => this.props.toggleScrollSync(),
					isActive: this.props.toolbarStatus.scrollSyncActive,
					icon: faArrowsAltH
				},
			],
			right: []
		}
	}

	componentDidMount() {
		setTimeout(() => this.animationDuration = 0.4, 0)

		// set the correct state if the user exits fullscreen by pressing the ESC key
		document.addEventListener("fullscreenchange", () => {
			if (!document.fullscreenElement) {
				this.setState({inFullscreenMode: false});
			}
		})
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
					{this.toolbarItems.left.map((item, index) => 
						<AnimateKeyframes
							key={index}
							play={this.state.visible}
							duration={this.animationDuration || 0}
							iterationCount={1}
							fillMode="forwards"
							direction={this.state.visible ? "normal" : "reverse"}
							keyframes={[
								{0: "transform: scale(0)"},
								{50: "transform: scale(1.1)"},
								{100: "transform: scale(1)"},
							]}
						>
							{!item.separator && 
								<IconButton
									key={uuid4()}
									title={item.title}
									onClick={item.onClick}
									isActive={item.isActive}
									isDisabled={item.isDisabled}
								>
									<FontAwesomeIcon icon={item.icon} />
								</IconButton>
							}
							
							{item.separator && <ButtonSeparator />}
						</AnimateKeyframes>
					)}
				</LeftSide>

				<RightSide>
				<IconButton
						title="TOGGELELE"
						onClick={() => this.setState({visible: !this.state.visible})}
					>
						<FontAwesomeIcon icon={faAnchor} />
					</IconButton>

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
							this.props.resetEditorLayout();
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

Toolbar.propTypes = {
	editorFocus: PropTypes.func,
  editorUndo: PropTypes.func,
  editorRedo: PropTypes.func,
  insertCode: PropTypes.func,
  insertLink: PropTypes.func,
  toggleZenMode: PropTypes.func,
  togglePreview: PropTypes.func,
  toggleScrollSync: PropTypes.func,
  resetEditorLayout: PropTypes.func,
  toolbarStatus: PropTypes.object,
}
