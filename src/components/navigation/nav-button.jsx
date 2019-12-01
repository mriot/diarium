import React from 'react';
import styled from 'styled-components';
import { NavLink } from "react-router-dom";

const activeClassName = "active";
const NavItem = styled(NavLink).attrs({activeClassName})`
  cursor: pointer;
  color: #459cce;
  padding: 10px 25px;
  margin: 0 5px;
  backface-visibility: hidden;
	perspective: 1000;
  transform: translate3d(0, 0, 0) skew(-25deg);
  transition: box-shadow 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), background 0.2s;

  & > span {
    display: inline-block;
    transform: skew(25deg);
  }

  &:hover {
    background-color: #33363E;
  }

  &.${activeClassName} {
    color: #00b7ff;
    box-shadow: 0 0px 1px 1px #00b7ff, inset 0 0 0px 0.2px #00b7ff;
  }
`

export default class NavButton extends React.PureComponent {

	static defaultProps = {
    to: "#",
    value: "Undefined prop 'value'"
	}
  
  render() {
    return (
      <NavItem to={this.props.to}>
        <span>{this.props.value}</span>
      </NavItem>
    );
  }
}
