import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ProgressContainer = styled.div`
  width: 95%;
  height: 10px;
  background: grey;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
`;

const ProgressFilling = styled.div`
  position: absolute;
  width: ${props => props.progress}%;
  height: 100%;
  background-color: #00b7ff;
  transition: all 500ms;
`;

export default function ProgressBar(props) {
  return (
    <ProgressContainer>
      <ProgressFilling progress={props.progress} />
    </ProgressContainer>
  );
}

ProgressBar.propTypes = {
  progress: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};
