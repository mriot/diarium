import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { faMapMarkerAlt, faBiohazard, faLock, faTheaterMasks, faCross, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Tag from "./tag";
import { updateExistingEntryById } from "../../lib/backend";
import { GlobalContext } from "../../contexts";

const rotate = keyframes `
	from {
		transform: rotate(0)
	}
	to {
		transform: rotate(360deg)
	}
`;

const TagEditorContainer = styled.div `
	color: #fff;
	width: 100%;
	padding: 10px 0;
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
const TagContainer = styled.div ` 
	display: grid;
	grid-gap: 3px;
	grid-template-columns: repeat(2, 1fr);
`;

export default class TagEditor extends React.PureComponent {
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
		this.setState({ checkboxDisabled: this.context.GLOBAL_READMODE });
	}

	_updateSelectedTags(newSelectedTags) {
		updateExistingEntryById(this.context.GLOBAL_DAYRECORD.id, { tags: newSelectedTags })
			.then(result => {
				if (!result.error) {
					this.context.UPDATE_GLOBAL_DAYRECORD(result);
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

		this._updateSelectedTags([...this.context.GLOBAL_DAYRECORD.tags, tag]);
	}

	removeFromSelectedTags(tag) {
		if (this.state.spinnerActive) return;
		this.setState({ spinnerActive: true });

		this._updateSelectedTags(this.context.GLOBAL_DAYRECORD.tags.filter(oldTag => oldTag !== tag));
	}

	render() {
		const { definedTags } = this.state;
		const { GLOBAL_DAYRECORD } = this.context;

		const selectedTags = GLOBAL_DAYRECORD ? GLOBAL_DAYRECORD.tags : [];
		return (
			<TagEditorContainer>
				<Heading>
					Tags <Spinner icon={faSyncAlt} spinning={this.state.spinnerActive ? 1 : 0} />
				</Heading>
				<TagContainer>
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
				</TagContainer>
			</TagEditorContainer>
		);
	}
}

TagEditor.propTypes = {};

TagEditor.defaultProps = {};

TagEditor.contextType = GlobalContext;
