import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { faMapMarkerAlt, faBiohazard, faLock, faTheaterMasks, faCross, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Tag from "./tag";
import { updateExistingEntryById } from "../../lib/backend";
import { DayRecordContext } from "../../contexts";

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
			definedTags: {
				highlight: { label: "Highlight", icon: faTheaterMasks },
				vacation: { label: "Urlaub", icon: faMapMarkerAlt },
				sick: { label: "Krank", icon: faBiohazard },
				nsfw: { label: "NSFW", icon: faLock },
				rip: { label: "RIP", icon: faCross },
			},
			checkboxDisabled: true,
			spinnerActive: false,
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.context.dayRecord) {
			this.setState({ checkboxDisabled: this.props.isReadModeActive });
		}
	}

	_updateSelectedTags(newSelectedTags) {
		updateExistingEntryById(this.context.dayRecord.id, { tags: newSelectedTags })
			.then(result => {
				if (!result.error) {
					this.context.updateDayRecord(result);
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

		this._updateSelectedTags([...this.context.dayRecord.tags, tag]);
	}

	removeFromSelectedTags(tag) {
		if (this.state.spinnerActive) return;
		this.setState({ spinnerActive: true });

		this._updateSelectedTags(this.context.dayRecord.tags.filter(oldTag => oldTag !== tag));
	}

	render() {
		const { definedTags } = this.state;
		const selectedTags = this.context.dayRecord ? this.context.dayRecord.tags : [];

		return (
			<MetaEditorContainer>
				<Heading>
					Tags <Spinner icon={faSyncAlt} spinning={this.state.spinnerActive ? 1 : 0} />
				</Heading>
				<MetaFields>
					{Object.keys(definedTags).map((tag, index) => (
						<Tag
							key={index}
							value={tag}
							label={definedTags[tag].label}
							icon={definedTags[tag].icon}
							disabled={this.state.checkboxDisabled}
							defaultChecked={selectedTags ? selectedTags.some(sTag => sTag === tag) : false}
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
	isReadModeActive: PropTypes.bool.isRequired,
};

MetaEditor.defaultProps = {};

MetaEditor.contextType = DayRecordContext;