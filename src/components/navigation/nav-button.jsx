import React from 'react';
import ReactDOM from "react-dom";
import styled from 'styled-components';
import { NavLink } from "react-router-dom";

const NavItem = styled(NavLink) `
  position: relative;
  cursor: pointer;
  color: #459cce;
  padding: 10px 15px;
  /* margin: 0 10px; */
  backface-visibility: hidden;
	perspective: 1000;
  /* transform: translate3d(0, 0, 0) skew(-25deg); */
  transition: box-shadow 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), background 0.2s;

  > span {
    display: inline-block;
    /* transform: skew(25deg); */
  }

  &:hover {
    background-color: #33363E;
  }

  &.active-NOPE {
    color: #00b7ff;
    box-shadow: 0 0px 1px 1px #00b7ff, inset 0 0 0px 0.2px #00b7ff;

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 18%;
      left: -2px;
      width: 3px;
      height: 25px;
      background-color: #20232a;
      transform: skew(25deg) rotate(25deg);
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
    
    this.navItemRef = React.createRef();

    this.state = {
      left: 0,
      width: 0,
    }
  }

  componentDidMount() {
    this.navItemNode = ReactDOM.findDOMNode(this.navItemRef.current);
    this.setState({
      left: this.navItemNode.offsetLeft,
      width: this.navItemNode.getBoundingClientRect().width,
    });
  }
  
	static defaultProps = {
    to: "#",
    value: "Undefined prop 'value'"
	}
  
  render() {
    const {left, width} = this.state;

    return (
      <NavItem to={this.props.to}
        ref={this.navItemRef}
        onClick={() => this.props.click({left, width})}
      >
        <span>{this.props.value}</span>
      </NavItem>
    );
  }
}
