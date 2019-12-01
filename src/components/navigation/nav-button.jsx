import React from 'react';
import styled from 'styled-components';
import { NavLink } from "react-router-dom";

const activeClassName = "active";
const NavItem = styled(NavLink).attrs({activeClassName})`
  cursor: pointer;
  color: #459cce;
  padding: 10px 25px;
  margin: 0 2.5px;
  transition: all 0.2s;
  transform: skew(-25deg);

  & > span {
    display: inline-block;
    transform: skew(25deg);
  }

  &:hover {
    background: #2c3148;
  }

  &.${activeClassName} {
    color: #00b7ff;
    /* box-shadow: 0 2px 0 #00b7ff; */
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
