import React from "react";
import styled from "styled-components";
import NavButton from "./nav-button";
import TextInput from "../common/textinput";

const Nav = styled.nav`
  width: 100%;
  height: auto;
  padding: 5px;
  display: flex;
  justify-content: flex-end;
  background-color: #20232a;
  box-sizing: border-box;
`
const Separator = styled.div `
  width: 2px;
  margin: 10px 0 10px 35px;
  background-color: #777;
`

export default class Navigation extends React.PureComponent {
  render() { 
    return (
      <Nav>
        <NavButton to="/edit" value="Eintrag bearbeiten" />
        <NavButton to="/save" value="Eintrag speichern" />
        <NavButton to="/favorites" value="Favoriten" />
        <TextInput />
        <Separator />
        <NavButton to="/logout" value="Logout" />
      </Nav>
    );
  }
}
