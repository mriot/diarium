import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { faMapMarkerAlt, faBiohazard, faLock, faTheaterMasks, faCross, faSync, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
	opacity: ${props => (props.active ? 1 : 0)};
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
		if (this.props.tags) {
			this.setState({ selectedTags: this.props.tags });
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.isReadModeActive !== this.props.isReadModeActive) {
			this.setState({ checkboxDisabled: this.props.isReadModeActive });
		}

		if (prevProps.tags !== this.props.tags) {
			this.setState({
				selectedTags: this.props.tags || [],
				checkboxDisabled: !this.props.recordID,
				spinnerActive: false
			});
		}

		if (prevState.selectedTags !== this.state.selectedTags) {
			this.props.tagsDidChange({
				date: this.props.recordDate,
				tags: this.state.selectedTags
			});
		}
	}

	addToSelectedTags(tag) {
		this.setState({ spinnerActive: true });
		const newSelectedTags = [...this.state.selectedTags, tag];

		updateExistingEntryById(this.props.recordID, {
			tags: newSelectedTags
		})
			.then(result => {
				if (!result.error) this.setState({ selectedTags: newSelectedTags });
				this.setState({ spinnerActive: false });
			});
	}

	removeFromSelectedTags(tag) {
		this.setState({ spinnerActive: true });
		const newSelectedTags = this.state.selectedTags.filter(oldTag => oldTag !== tag);

		updateExistingEntryById(this.props.recordID, {
			tags: newSelectedTags
		})
			.then(result => {
				if (!result.error) this.setState({ selectedTags: newSelectedTags });
				this.setState({ spinnerActive: false });
			});
	}

	render() {
		const { tags, selectedTags } = this.state;

		return (
			<MetaEditorContainer>
				<Heading>
					Tags <Spinner icon={faSyncAlt} active={this.state.spinnerActive} />
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
