import React from "react";
import styled from "styled-components";
import NavButton from "./nav-button";
import TextInput from "../common/textinput";

const Nav = styled.nav`
  width: 100%;
  height: auto;
  padding: 5px;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  background-color: #20232a;
`
const ButtonContainer = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-around;
`
const Logo = styled.span `
  color: #fff;
  font-size: 30px;
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
        <Logo>DIARIUM</Logo>
        <ButtonContainer>
          <NavButton to="/edit" value="Eintrag bearbeiten" />
          <NavButton to="/save" value="Eintrag speichern" />
          <NavButton to="/favorites" value="Favoriten" />
          <TextInput />
          <Separator />
          <NavButton to="/logout" value="Logout" />
        </ButtonContainer>
      </Nav>
    );
  }
}
