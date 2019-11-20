import React from 'react';
import styled from 'styled-components';
import { NavLink } from "react-router-dom";

const activeClassName = "active";
const NavItem = styled(NavLink).attrs({activeClassName})`
  cursor: pointer;
  color: #61dafb;
  padding: 15px 25px;
  margin: 0 2.5px;
  transition: all 0.2s;

  &:hover {
    color: #000;
    background-color: #61dafb;
  }

  &.${activeClassName} {
    color: #000;
    background-color: #61dafb;
  }
`;

export default class NavButton extends React.PureComponent {

	static defaultProps = {
    to: "#",
    value: "Undefined prop 'value'"
	}
  
  render() {
    return (
      <NavItem to={this.props.to}>
        {this.props.value}
      </NavItem>
    );
  }
}
