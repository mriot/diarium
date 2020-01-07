import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import moment from "moment";
import TextInput from "../common/textinput";
import { search } from "../../lib/backend";

const StyledSearch = styled.div `
	position: relative;
`;
const StyledTextInput = styled(TextInput) `
	width: 20vw;
  min-width: 200px;
	max-width: 500px;
	box-sizing: border-box;
	
	&:focus {
    min-width: 350px;
    box-shadow: 0 0 0 1px #555;
  }
`;
const SearchResultContainer = styled.div `
	position: absolute;
	top: 100%;
	width: 100%;
	color: #fff;
	z-index: 10;
	overflow: hidden;
	border-radius: 3px;
	box-shadow: 1px 5px 7px 1px rgba(0, 0, 0, 0.5);
	background-color: #20232a;
`;
const SearchResult = styled.div `
	padding: 10px;
	cursor: pointer;
	border-bottom: 1px solid #191919;
	
	span {
		font-size: 13px;
		font-weight: bold;
	}

	div {
		font-size: 13px;
		margin-top: 5px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&:hover {
		background-color: rgba(200, 200, 200, 0.1);
	}
`;

export default class Search extends React.PureComponent {
	constructor(props) {
		super(props);

		this.handleOutsideClick = this.handleOutsideClick.bind(this);

		this.state = {
			searchResults: [],
			showSearchResults: false,
		};
	}

	setShowResults(status) {
		if (status) document.addEventListener("mousedown", this.handleOutsideClick, false);
		else document.removeEventListener("mousedown", this.handleOutsideClick, false);

		this.setState({ showSearchResults: status });
	}

	handleChange(query) {
		if (query.length < 3) {
			this.setShowResults(false);
			return;
		}
		search(query).then(res => {
			if (res.records_found < 1) return;
			this.setState({ searchResults: res.records });
			this.setShowResults(true);
		});
	}

	handleOutsideClick(event) {
		console.log("ref1", this.input);
		if (this.input.contains(event.target)) return;
		this.setShowResults(false);
	}

	componentDidMount() {
		console.log("ref", this.input);
	}
	

	render() {
		return (
			<StyledSearch ref={input => (this.input = input)}>
				<StyledTextInput {...this.props}
					onChange={event => this.handleChange(event.currentTarget.value)}
				/>
	
				<SearchResultContainer>
					{this.state.showSearchResults && this.state.searchResults.map(item => (
						<SearchResult key={item.id} onClick={null} title={item.content}>
							<span>{moment(item.assignedDay).format("dd, DD. MMMM YYYY")}</span>
							<div>
								{item.content}
							</div>
						</SearchResult>
					))}
				</SearchResultContainer>
			</StyledSearch>
		);
	}
}

Search.propTypes = {
	
};
