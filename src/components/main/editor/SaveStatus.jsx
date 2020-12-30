import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// && -> to give it more specificity
// https://github.com/styled-components/styled-components/issues/1816#issuecomment-398454088
const StyledSaveStatus = styled.div`
 && {
    color: ${props => props.status?.error ? "#D8000C" : "#9C9C9C"};
    align-items: center;
    display: flex;
    font-size: 14px;
    margin-left: 4px;
    padding: 0 8px;
    border-left: 1px solid #ccc;
    user-select: none;
  }
`;

export default function SaveStatus(props) {
  const TARGET_NODE = document.querySelector(".tox-menubar");

  // console.log(props.status);

  const displayText = () => {
    const { status } = props;

    if (status?.error) {
      return "Error! " + status.error;
    }

    if (status?.time) {
      const saveTime = dayjs(status.time);

      if (dayjs().diff(saveTime, "hour") < 1) {
        return "Gespeichert " + saveTime.fromNow();
      } else if (dayjs().diff(saveTime, "day") < 1) {
        return "Gespeichert heute um " + saveTime.format("HH:mm:ss") + " Uhr";
      } else {
        return "Gespeichert am " + saveTime.format("dd, DD.MM.YYYY HH:mm:ss") + " Uhr";
      }
    }

    return "Wird gespeichert...";
  };

  return (
    TARGET_NODE && ReactDOM.createPortal(
      <StyledSaveStatus {...props}>
        {displayText()}
      </StyledSaveStatus>,
      TARGET_NODE
    )
  );
}

SaveStatus.propTypes = {
  status: PropTypes.object
};
