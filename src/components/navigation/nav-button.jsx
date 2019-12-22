import React from 'react';
import styled from 'styled-components';
import PropTypes from "prop-types";
// import { NavLink } from "react-router-dom";

const NavItem = styled.div `
  position: relative;
  cursor: pointer;
  color: #9e9e9e;
  padding: 7px 20px;
  margin: 0 5px;
  border-bottom: 1px solid transparent;
	perspective: 1000;
  backface-visibility: hidden;
  user-select: none;
  transition: all 0.2s;

  > span {
    display: inline-block;
  }

  &:hover {
    background-color: #33363E;
  }

  ${props => !props.active} {
    color: #00b7ff;
    border-color: #00b7ff;
  }
`

export default class NavButton extends React.PureComponent {
  render() {
    return (
      <NavItem active={this.props.active} {...this.props}>
        <span>{this.props.value}</span>
      </NavItem>
    );
  }
}

NavButton.propTypes = {
  active: PropTypes.bool,
  value: PropTypes.string.isRequired,
}
