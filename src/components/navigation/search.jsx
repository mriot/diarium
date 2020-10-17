import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import moment from "moment";
import posed, { PoseGroup } from "react-pose";
import { NavLink } from "react-router-dom";
import TextInput from "../common/textinput";
import { search } from "../../lib/backend";
import { searchResultAnimation } from "./animations";

const StyledSearch = styled.div`
  position: relative;
  margin: 0 30px;
`;
const StyledTextInput = styled(TextInput)`
  width: 20vw;
  min-width: 200px;
  max-width: 500px;
  box-sizing: border-box;

  &:focus {
    box-shadow: none;
  }
`;
const SearchResultContainer = styled.div`
  position: absolute;
  top: 100%;
  width: 100%;
  color: #fff;
  z-index: 10;
  overflow: hidden;
  border-radius: 3px;
  box-sizing: border-box;
  box-shadow: 1px 5px 7px 1px rgba(0, 0, 0, 0.5);
  background-color: #20232a;
`;
const PosedResult = posed(NavLink)(searchResultAnimation);
const SearchResult = styled(PosedResult)`
  display: block;
  color: inherit;
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

export default function Search(props) {
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    if (showSearchResults) {
      document.addEventListener("mousedown", handleOutsideClick, false);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick, false);
    }
  }, [showSearchResults]);

  const handleOutsideClick = (event) => {
    // if (input.contains(event.target)) return;
    // setShowSearchResults(false);
  };

  const handleChange = async (query) => {
    if (query.length < 3) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    const result = await search(query);
    if (result.records_found < 1) {
      setShowSearchResults(false);
      return;
    }

    setSearchResults(result.records);
    setShowSearchResults(true);
  };

  return (
    <StyledSearch ref={input => input}>
      <StyledTextInput {...props}
        autocomplete="off" autocorrect="off" spellcheck="false" type="search"
        onChange={event => handleChange(event.currentTarget.value)}
        onFocus={() => setShowSearchResults(!!searchResults)}
      />

      <SearchResultContainer>
        <PoseGroup>
          {showSearchResults && searchResults.map(item => (
            <SearchResult
              key={item.id}
              title={item.content}
              to={`/${moment(item.assignedDay).format("YYYY/MM/DD")}`}
            >
              <span>{moment(item.assignedDay).format("dd, DD. MMMM YYYY")}</span>
              <div>
                {item.content}
              </div>
            </SearchResult>
          ))}
        </PoseGroup>
      </SearchResultContainer>
    </StyledSearch>
  );
}

Search.propTypes = {};
