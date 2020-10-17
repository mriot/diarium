import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledButton = styled.div`
  position: relative;
  color: #fff;
  background-color: #363b47;
  cursor: pointer;
  text-decoration: none;
  padding: 7px 10px;
  border-radius: 5px;
  display: inline-block;
  border: none;
  user-select: none;
  transition: all 0.2s linear;

  &::after {
    content: ">";
    position: absolute;
    top: 50%;
    right: 33%;
    opacity: 0;
    transform: translateY(-50%);
    transition: all 0.2s;
  }

  &:active {
    box-shadow: inset 0 0px 0 -5px rgba(0, 0, 0, 0.17);
  }

  &:hover {
    padding-right: 25px;
    box-shadow: 5px 40px -10px rgba(0,0,0,0.57);
    transition: all 0.4s ease 0s;

    &::after {
      opacity: 1;
      right: 10px;
    }
  }
`;

export default function Button(props) {
  return (
    <StyledButton {...props}>
      {props.children}
    </StyledButton>
  );
}

Button.propTypes = {
  children: PropTypes.any
};
