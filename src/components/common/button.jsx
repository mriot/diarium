import React from 'react';
import styled from "styled-components";


const StyledButton = styled.div `
  position: relative;
  color: #fff;
  background-color: ${props => props.backgroundColor || "#434343"};
  cursor: pointer;
  text-transform: uppercase;
  text-decoration: none;
  padding: 7px 10px;
  border-radius: 5px;
  display: inline-block;
  border: none;
  user-select: none;
  transition: all 0.2s linear;
  /* background-color: ${props => 
    props.primary ? "green" : "palevioletred"
  }; */

  &:hover {
    background-color: ${props => props.hoverBackgroundColor || "#009283"};
    ${props => 
      props.withArrow ? {"padding-right": "25px"} : {"transform": "scale(1.1)"}
    }
    box-shadow: 5px 40px -10px rgba(0,0,0,0.57);
    transition: all 0.4s ease 0s;

    &::after {
      opacity: 1;
      right: 5px;
    }
  }

  &:active {
    box-shadow: inset 0 0px 0 -5px rgba(0, 0, 0, 0.17);
  }

  &::after {
    content: ">";
    line-height: 1;
    position: absolute;
    right: 25%;
    opacity: 0;
    transition: all 0.2s;

    ${props =>
      !props.withArrow &&
      {"display": "none"}
    }
  }
`

export default class Button extends React.PureComponent {
  render() {
    return (
      <StyledButton {...this.props}>
        {this.props.children}
      </StyledButton>
    );
  }
}
