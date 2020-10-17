import React from "react";
import styled, { keyframes } from "styled-components";
import { PropTypes } from "prop-types";

const shakeAnimation = keyframes`
  0% {
    stroke-dashoffset: -100%;
  }
  100% {
    stroke-dashoffset: ${props => props.progress};
  }
`;
const StyledRadialProgress = styled.div`
  position: relative;
  transform: rotate(-90deg);

  & circle {
    animation: ${shakeAnimation} 1s ease-in-out;
    transition: all 1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  }
`;
const ProgressText = styled.div`
  position: absolute;
  color: rgb(232, 23, 96);
  top: 50%;
  left: 50%;
  padding: 0;
  margin: 0;
  transform: rotate(90deg) translate(-50%, -50%);
`;

export default function RadialProgress(props) {
  return (
    <StyledRadialProgress>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="15" fill="transparent"
          strokeWidth="3"
          stroke="grey"
        />
        <circle cx="50" cy="50" r="15" fill="transparent"
          strokeWidth="3"
          stroke="#00CCFF"
          strokeDasharray="251.2"
          strokeDashoffset={0}
        />
      </svg>
      <ProgressText>
        {props.progress + "%"}
      </ProgressText>
    </StyledRadialProgress>
  );
}

RadialProgress.propTypes = {
  progress: PropTypes.Number
};
