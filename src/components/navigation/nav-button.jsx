import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavItem = styled.div`
  position: relative;
  cursor: pointer;
  color: #9e9e9e;
  padding: 7px 20px;
  margin: 0 5px;
  border-radius: 3px;
  border-bottom: 1px solid transparent;
  backface-visibility: hidden;
  user-select: none;
  transition: all 0.2s;

  > span {
    display: inline-block;
    margin-left: ${props => (props.value && props.icon ? 10 : 0)}px;
  }

  &:hover {
    background-color: #33363E;
  }

  ${props => !props.active} {
    color: #00b7ff;
    border-color: #00b7ff;
    border-radius: 3px 3px 0 0;
  }
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  position: relative;
  top: 1px;
`;

export default function NavButton(props) {
  return (
    <NavItem active={props.active} {...props}>
      {props.icon && <StyledFontAwesomeIcon icon={props.icon} />}
      <span>{props.value}</span>
    </NavItem>
  );
}

NavButton.propTypes = {
  active: PropTypes.bool,
  value: PropTypes.string,
  icon: PropTypes.object
};

NavButton.defaultProps = {
  active: false,
  value: "",
  icon: null
};
