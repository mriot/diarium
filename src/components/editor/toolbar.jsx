import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndoAlt, faColumns, faImage, faLink, faCode, faExpand, faCompress, faShare, faReply, faVihara, faArrowsAltH } from "@fortawesome/free-solid-svg-icons";
import posed from "react-pose";
import { toolbarItemsAnimation } from "./animations";

const StyledToolbar = styled.div `
	width: 100%;
	height: 35px;
	flex-shrink: 0;
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
		border-radius: 0;
		border-bottom: none;
	`}
`;
const LeftSide = styled.aside `
	display: flex;
	align-items: center;
`;
const RightSide = styled.aside `
	display: flex;
	align-items: center;
`;
const PosedButtonSeparator = posed.div(toolbarItemsAnimation);
const ButtonSeparator = styled(PosedButtonSeparator) `
	width: 2px;
	height: 60%;
	margin: 0 5px;
	background-color: #c7c7c7;
`;
const PosedIconButton = posed.div(toolbarItemsAnimation);
const IconButton = styled(PosedIconButton) `
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
`;
const SaveStatusText = styled.div `
	margin-left: 5px;
	color: #777;
`;

export default class Toolbar extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			inFullscreenMode: false,
			readMode: this.props.toolbarStatus.readModeActive,
			saveStatusText: "Speichern...",
		};
		
		this.toolbarItems = {
			left: [
				{
					title: "Rückgängig",
					onClick: () => this.props.editorUndo(),
					isDisabled: () => this.props.toolbarStatus.editorHistory.undo <= 0,
					icon: faReply,
				},
				{
					title: "Wiederholen",
					onClick: () => this.props.editorRedo(),
					isDisabled: () => this.props.toolbarStatus.editorHistory.redo <= 0,
					icon: faShare,
				},
				{
					title: "Bild einfügen",
					onClick: null,
					icon: faImage,
				},
				{
					title: "Link einfügen",
					onClick: () => this.props.insertLink(),
					icon: faLink,
				},
				{
					title: "Code einfügen",
					onClick: () => this.props.insertCode(),
					icon: faCode,
				},
				{ separator: true, },
				{
					title: "Scrollen synchronisieren",
					onClick: () => this.props.toggleScrollSync(),
					isActive: () => this.props.toolbarStatus.scrollSyncActive,
					icon: faArrowsAltH
				},
			],
			
			right: [
				{
					title: "Zen-Mode",
					onClick: () => this.props.toggleZenMode(),
					isActive: () => this.props.toolbarStatus.zenModeActive,
					icon: faVihara,
				},
				{
					title: "Ansicht splitten",
					onClick: () => this.props.togglePreview(),
					isActive: () => this.props.toolbarStatus.previewActive,
					icon: faColumns,
					hiddenInReadMode: true,
				},
				{
					title: "Vollbild",
					onClick: () => {
						this.toggleFullScreen();
						this.props.editorFocus();
					},
					isActive: () => this.state.inFullscreenMode,
					icon: this.state.inFullscreenMode ? faCompress : faExpand,
				},
				{
					title: "Layout des Editors zurücksetzen",
					onClick: () => {
						this.props.resetEditorLayout();
						if (this.state.inFullscreenMode) this.toggleFullScreen();
					},
					icon: faUndoAlt,
					hiddenInReadMode: true,
				},
			],
		};
	}

	componentDidMount() {
		// set the correct state if the user exits fullscreen by pressing the ESC key
		document.addEventListener("fullscreenchange", () => {
			if (!document.fullscreenElement) {
				this.setState({ inFullscreenMode: false });
			}
		});
	}

	componentDidUpdate() {
		this.setState({ readMode: this.props.toolbarStatus.readModeActive });
	}
	
	toggleFullScreen() {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().then(
				this.setState({ inFullscreenMode: true })
			);
		} else if (document.exitFullscreen) {
			document.exitFullscreen().then(
				this.setState({ inFullscreenMode: false })
			);
		}
	}

	render() {
		return (
			<StyledToolbar {...this.props}>
				<LeftSide>
					{this.toolbarItems.left.map((item, index) => [
						!item.separator && (
							<IconButton
								key={index}
								pose={this.state.readMode ? "hide" : "show"}
								title={item.title}
								onClick={item.onClick}
								isActive={item.isActive && item.isActive()}
								isDisabled={item.isDisabled && item.isDisabled()}
							>
								<FontAwesomeIcon icon={item.icon} />
							</IconButton>
						), // <- we're in an array

						item.separator && <ButtonSeparator key={index} pose={this.state.readMode ? "hide" : "show"} />
					])}

					<ButtonSeparator pose={this.state.readMode ? "hide" : "show"} />

					<SaveStatusText>
						{this.state.saveStatusText}
					</SaveStatusText>
				</LeftSide>

				<RightSide>
					{this.toolbarItems.right.map((item, index) => (
						<IconButton
							key={index}
							pose={item.hiddenInReadMode && this.state.readMode ? "hide" : "show"}
							title={item.title}
							onClick={item.onClick}
							isActive={item.isActive && item.isActive()}
						>
							<FontAwesomeIcon icon={item.icon} />
						</IconButton>
					))}
				</RightSide>
			</StyledToolbar>
		);
	}
}

Toolbar.propTypes = {
	editorFocus: PropTypes.func.isRequired,
	editorUndo: PropTypes.func.isRequired,
	editorRedo: PropTypes.func.isRequired,
	insertCode: PropTypes.func.isRequired,
	insertLink: PropTypes.func.isRequired,
	toggleZenMode: PropTypes.func.isRequired,
	togglePreview: PropTypes.func.isRequired,
	toggleScrollSync: PropTypes.func.isRequired,
	resetEditorLayout: PropTypes.func.isRequired,
	toolbarStatus: PropTypes.object.isRequired,
};
