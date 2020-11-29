import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

// && -> to give it more specificity
// https://github.com/styled-components/styled-components/issues/1816#issuecomment-398454088
const StyledSaveStatusText = styled.div`
 && {
    color: #9c9c9c;
    align-items: center;
    display: flex;
    font-size: 14px;
    margin-left: 4px;
    padding: 0 8px;
    border-left: 1px solid #ccc;
    user-select: none;
  }
`;

export default function SaveStatusText(props) {
  const node = document.querySelector(".tox-menubar");

  return (
    node && ReactDOM.createPortal(
      <StyledSaveStatusText {...props}>
        {props.text}
      </StyledSaveStatusText>,
      document.querySelector(".tox-menubar")
    )
  );
}

SaveStatusText.propTypes = {
  text: PropTypes.string
};
