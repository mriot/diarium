import React from "react";
import styled from "styled-components";
import NavButton from "./nav-button";
import TextInput from "../common/textinput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

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
`
const Logo = styled.span `
  color: #fff;
  font-size: 30px;
  z-index: 1;
`
const RightSide = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-around;
`
const ButtonContainer = styled.div `
  position: relative;
  display: flex;
  margin-right: 20px;
`
const ActiveButtonSlider = styled.div `
  position: absolute;
  bottom: 10%;
  height: 2px;
  left: ${props => props.offsetX || 0}px;
  width: calc(${props => props.width || 0}px / 2);
  transform: translateX(50%);
  background-color: #555;
  transition: all 0.5s cubic-bezier(1, 0.01, 0, 1.22);
`
const Separator = styled.div `
  width: 2px;
  align-self: stretch;
  margin: 7px 5px 7px 20px;
  background-color: rgba(255, 255, 255, 0.5);
`
const LogoutButton = styled.div `
  color: #459cce;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    color: red;
    /* background-color: #333; */
  }
`

export default class Navigation extends React.PureComponent {
  constructor(props) {
    super(props);
  
    this.state = {
      sliderOffsetX: 0,
      sliderWidth: 0,
    }
  }

  moveSliderToActiveButton(positionData) {
    this.setState({
      sliderOffsetX: positionData.left,
      sliderWidth: positionData.width
    })
  }
  
  render() { 
    return (
      <Nav>
        <Logo>DIARIUM</Logo>
        <RightSide>
          <ButtonContainer>
            <NavButton to="/edit" value="Bearbeiten" click={this.moveSliderToActiveButton.bind(this)} />
            <NavButton to="/favorites" value="Favoriten" click={this.moveSliderToActiveButton.bind(this)} />
            <ActiveButtonSlider width={this.state.sliderWidth} offsetX={this.state.sliderOffsetX} />
          </ButtonContainer>

          <TextInput placeholder="Suchen..." />

          <Separator />
          
          <LogoutButton>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </LogoutButton>
        </RightSide>
      </Nav>
    );
  }
}
