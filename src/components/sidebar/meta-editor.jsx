import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { faMapMarkerAlt, faBiohazard, faLock, faTheaterMasks, faCross } from "@fortawesome/free-solid-svg-icons";
import Tag from "./tag";
import { updateExistingEntryById } from "../../lib/backend";

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
			checkboxDisabled: false,
			selectedTags: [],
		};
	}

	componentDidMount() {
		if (this.props.isReadModeActive) {
			this.setState({ checkboxDisabled: true });
		}

		if (this.props.tags) {
			this.setState({ selectedTags: this.props.tags });
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.isReadModeActive !== this.props.isReadModeActive) {
			this.setState({ checkboxDisabled: this.props.isReadModeActive });
		}

		if (this.props.tags !== prevProps.tags) {
			this.setState({
				selectedTags: this.props.tags || [],
				checkboxDisabled: !this.props.recordID
			});
		}
	}

	addToSelectedTags(tag) {
		const newSelectedTags = [...this.state.selectedTags, tag];

		updateExistingEntryById(this.props.recordID, {
			tags: newSelectedTags
		})
			.then(result => {
				if (!result.error) this.setState({ selectedTags: newSelectedTags });
			});
	}

	removeFromSelectedTags(tag) {
		const newSelectedTags = this.state.selectedTags.filter(oldTag => oldTag !== tag);

		updateExistingEntryById(this.props.recordID, {
			tags: newSelectedTags
		})
			.then(result => {
				if (!result.error) this.setState({ selectedTags: newSelectedTags });
			});
	}

	render() {
		const { tags, selectedTags } = this.state;

		return (
			<MetaEditorContainer>
				<Heading>Tags</Heading>
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
	isReadModeActive: PropTypes.bool.isRequired,
};

MetaEditor.defaultProps = {
	tags: [],
	recordID: -1,
};
