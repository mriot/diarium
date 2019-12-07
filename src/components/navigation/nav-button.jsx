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
  backface-visibility: hidden;
	perspective: 1000;
  transform: skew(-20deg);
  transition: box-shadow 0.5s, background 0.2s;

  > span {
    display: inline-block;
    transform: skew(20deg);
  }

  &:hover {
    background-color: #33363E;
  }

  ${props => !props.active} {
    color: #00b7ff;
    box-shadow: 0 0 0 1px #00b7ff;

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 10%;
      left: -2px;
      width: 3px;
      height: 25px;
      background-color: #20232a;
      transform: skew(20deg) rotate(20deg);
      /* outline: 1px solid; */
    }
    &::after {
      left: auto;
      right: -2px;
    }
  }
`

export default class NavButton extends React.PureComponent {
  constructor(props) {
    super(props);
  
    this.state = {
      active: false,
    }
  }

	static defaultProps = {
    to: "#",
    value: "Undefined prop 'value'"
	}
  
  render() {
    return (
      <NavItem active={this.state.active} onClick={() => this.setState({active: !this.state.active})}>
        <span>{this.props.value}</span>
      </NavItem>
    );
  }
}

NavButton.propTypes = {
  // as this component is still WIP, I'll leave it like this for now.
}
