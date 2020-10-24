import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

const StyledButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  color: #efefef;
  background-color: #363b47;
  cursor: pointer;
  text-decoration: none;
  padding: 7px 10px;
  border-radius: 5px;
  border: none;
  user-select: none;
  transition: all 0.2s;
  white-space: nowrap;
  text-decoration: none;

  &::after {
    content: "";
    position: relative;
    width: 8px;
    height: 8px;
    border: 1px solid transparent;
    border-top-color: #efefef;
    border-right-color: #efefef;
    opacity: 0;
    transform: rotate(45deg) translate(-20px, 20px);
    transition-delay: 0;
    transition-duration: 0;
  }

  &:hover {
    padding-right: 25px;
    box-shadow: 5px 40px -10px rgba(0,0,0,0.57);
    transition: all 0.4s ease 0s;

    &::after {
      opacity: 1;
      transform: rotate(45deg) translate(5px, -5px);
      transition: all 200ms ease;
      transition-delay: 100ms;
    }
  }

  &:active {
    box-shadow: inset 0 0px 0 -5px rgba(0, 0, 0, 0.17);
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
