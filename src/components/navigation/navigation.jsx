import React from "react";
import styled from "styled-components";

const Nav = styled.nav`
  width: 100%;
  height: auto;
  padding: 5px;
  display: flex;
  justify-content: center;
  background-color: #20232a;
  box-sizing: border-box;
`

export default class Navigation extends React.PureComponent {
  render() { 
    return (
      <Nav>
       {this.props.children}
      </Nav>
    );
  }
}
