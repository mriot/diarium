import React from "react";
import styled from "styled-components";
import NavButton from "./nav-button";
import TextInput from "../common/textinput";
import { particleStorm } from "../../utils/particle-wave";

const Nav = styled.nav`
  width: 100%;
  height: auto;
  padding: 5px;
  display: flex;
  position: relative;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  background-color: #20232a;
  border-bottom: 1px solid #191919;
  box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
`
const ButtonContainer = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-around;
`
const Canvas = styled.canvas `
  position: absolute;
`
const Logo = styled.span `
  color: #fff;
  font-size: 30px;
  z-index: 1;
`
const Separator = styled.div `
  width: 2px;
  align-self: stretch;
  margin: 10px 0 10px 35px;
  background-color: #181818;
`

export default class Navigation extends React.PureComponent {
  componentDidMount() {
    // particleStorm()
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen(); 
      }
    }
  }
  
  render() { 
    return (
      <Nav>
        {/* <Canvas id="canvas"></Canvas> */}
        <Logo>DIARIUM</Logo>
        <ButtonContainer>
          <NavButton to="/edit" value="Bearbeiten" />
          <NavButton to="/save" value="Speichern" />
          <NavButton to="/favorites" value="Favoriten" />
          <TextInput />
          <Separator />
          <NavButton to="/logout" value="Logout" />
        </ButtonContainer>
      </Nav>
    );
  }
}
