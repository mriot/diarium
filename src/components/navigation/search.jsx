import { NavLink } from "react-router-dom";
import { search } from "../../backend/search";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import TextInput from "../common/textinput";
import dayjs from "dayjs";
import styled from "styled-components";

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
const SearchResult = styled(NavLink)`
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

    const response = await search(query);
    if (response.data.records_found < 1) {
      setShowSearchResults(false);
      return;
    }

    setSearchResults(response.data.records);
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
        {showSearchResults && searchResults.map(item => (
          <SearchResult
            key={item.entry_id}
            title={item.content}
            to={`/${dayjs(item.assigned_day).format("YYYY/MM/DD")}`}
          >
            <span>{dayjs(item.assigned_day).format("dd, DD. MMMM YYYY")}</span>
            <div>
              {item.sanitized_content}
            </div>
          </SearchResult>
        ))}
      </SearchResultContainer>
    </StyledSearch>
  );
}

Search.propTypes = {};
