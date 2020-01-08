import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { faMapMarkerAlt, faBiohazard, faLock, faTheaterMasks, faCross } from "@fortawesome/free-solid-svg-icons";
import Checkbox from "../common/checkbox";

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

	${Checkbox} {
		line-height: 2;
	}
`;

export default class MetaEditor extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.state = {
			tags: {
				highlight: { label: "Highlight", icon: faTheaterMasks, disabled: false, checked: false, },
				vacation: { label: "Urlaub", icon: faMapMarkerAlt, disabled: false, checked: false, },
				sick: { label: "Krank", icon: faBiohazard, disabled: false, checked: false, },
				nsfw: { label: "NSFW", icon: faLock, disabled: false, checked: false, },
				rip: { label: "RIP", icon: faCross, disabled: false, checked: false, },
			},
			checkboxDisabled: this.props.isReadModeActive,
			selectedTags: [],
		};
	}

	componentDidMount() {
		this.updateTags(this.props.tags);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.isReadModeActive !== this.props.isReadModeActive) {
			this.setState({ checkboxDisabled: this.props.isReadModeActive });
		}

		if (prevProps.tags !== this.props.tags) {
			this.updateTags(this.props.tags);
		}
	}

	updateTags(changedTags) {
		// console.log(changedTags);
		changedTags.forEach(tag => {
			this.setState(prevState => ({
				tags: {
					...prevState.tags,
					[tag]: {
						...prevState.tags[tag],
						checked: true
					}
				}
			}));
		});
	}

	addToSelectedTags() {
		console.log(this, "asd");
	}

	render() {
		const { tags } = this.state;

		return (
			<MetaEditorContainer>
				<Heading>Tags</Heading>
				<MetaFields>
					{Object.keys(tags).map((tag, index) => (
						<Checkbox
							key={index}
							label={tags[tag].label}
							icon={tags[tag].icon}
							value={tags[tag].value}
							checked={tags[tag].checked}
							disabled={this.state.checkboxDisabled}
							click={() => this.setState(prevState => ({
								selectedTags: [...prevState.selectedTags, tags[tag].value]
							}))}
						/>
					))}
				</MetaFields>
			</MetaEditorContainer>
		);
	}
}

MetaEditor.propTypes = {
	isReadModeActive: PropTypes.bool.isRequired,
	tags: PropTypes.array.isRequired,
};
