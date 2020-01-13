import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { faMapMarkerAlt, faBiohazard, faLock, faTheaterMasks, faCross, faSync, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Tag from "./tag";
import { updateExistingEntryById } from "../../lib/backend";

const rotate = keyframes `
	from {
		transform: rotate(0)
	}
	to {
		transform: rotate(360deg)
	}
`;

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
const Spinner = styled(FontAwesomeIcon) `
	opacity: ${props => (props.spinning ? 1 : 0)};
	font-size: 16px;
	margin-left: 5px;
	transition-delay: 100ms;
	animation: 1s ${rotate} linear infinite;
`;
const MetaFields = styled.div ` 
	display: flex;
	flex-direction: column;
`;

export default class MetaEditor extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.state = {
			tags: {
				highlight: { label: "Highlight", icon: faTheaterMasks },
				vacation: { label: "Urlaub", icon: faMapMarkerAlt },
				sick: { label: "Krank", icon: faBiohazard },
				nsfw: { label: "NSFW", icon: faLock },
				rip: { label: "RIP", icon: faCross },
			},
			checkboxDisabled: true,
			selectedTags: [],
			spinnerActive: false,
		};
	}

	componentDidMount() {
		// get tags from selected day — if any
		if (this.props.tags) {
			this.setState({ selectedTags: this.props.tags });
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// readmode prop changed -> e.g. activated edit mode
		if (prevProps.isReadModeActive !== this.props.isReadModeActive) {
			this.setState({ checkboxDisabled: this.props.isReadModeActive });
		}

		// tags prop changed -> e.g. other day selected
		if (prevProps.tags !== this.props.tags) {
			this.setState({
				selectedTags: this.props.tags || [],
				checkboxDisabled: !this.props.recordID,
				spinnerActive: false
			});
		}

		// selected tags state changed -> this is for updating the Calendar component
		if (prevState.selectedTags !== this.state.selectedTags) {
			// provide the current, active tags and the associated date
			this.props.tagsDidChange({
				date: this.props.recordDate,
				tags: this.state.selectedTags
			});
		}
	}

	_updateSelectedTags(newSelectedTags) {
		updateExistingEntryById(this.props.recordID, { tags: newSelectedTags })
			.then(result => {
				if (!result.error) {
					this.setState({ selectedTags: newSelectedTags });
				} else {
					toast.error("Die Tags konnten leider nicht geupdated werden... 😟");
				}
				this.setState({ spinnerActive: false });
			})
			.catch(error => console.log(error));
	}

	addToSelectedTags(tag) {
		if (this.state.spinnerActive) return;
		this.setState({ spinnerActive: true });

		this._updateSelectedTags([...this.state.selectedTags, tag]);
	}

	removeFromSelectedTags(tag) {
		if (this.state.spinnerActive) return;
		this.setState({ spinnerActive: true });

		this._updateSelectedTags(this.state.selectedTags.filter(oldTag => oldTag !== tag));
	}

	render() {
		const { tags, selectedTags } = this.state;

		return (
			<MetaEditorContainer>
				<Heading>
					Tags <Spinner icon={faSyncAlt} spinning={this.state.spinnerActive ? 1 : 0} />
				</Heading>
				<MetaFields>
					{Object.keys(tags).map((tag, index) => (
						<Tag
							key={index}
							value={tag}
							label={tags[tag].label}
							icon={tags[tag].icon}
							disabled={this.state.checkboxDisabled}
							defaultChecked={selectedTags.some(sTag => sTag === tag)}
							addToSelectedTags={newTag => this.addToSelectedTags(newTag)}
							removeFromSelectedTags={oldTag => this.removeFromSelectedTags(oldTag)}
						/>
					))}
				</MetaFields>
			</MetaEditorContainer>
		);
	}
}

MetaEditor.propTypes = {
	tags: PropTypes.array,
	recordID: PropTypes.number,
	recordDate: PropTypes.string,
	isReadModeActive: PropTypes.bool.isRequired,
	tagsDidChange: PropTypes.func.isRequired,
};

MetaEditor.defaultProps = {
	tags: [],
	recordID: -1,
	recordDate: null,
};
