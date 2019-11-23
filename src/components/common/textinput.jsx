import React from 'react';
import styled from "styled-components";


const requiredClassName = "required";
const StyledTextInput = styled.input.attrs({requiredClassName}) `
  color: #5C5C5C;
  outline: none;
  border: none;
  border-radius: 3px;
  text-shadow: 0px 1px 0 #fff;
  font-size: inherit;
  margin-top: 0;
  padding: 7px 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: border 0.3s, box-shadow 0.2s, color 0.5s;

  ${props => props.underline &&
    `
      border-radius: 0;
      border: 0;
      box-shadow: none;
      border-bottom: 1px solid #c2c2c2;
      background-color: rgba(0, 0, 0, 0.0);
      background-color: #fff;
    `
  }

  &:focus {
    border-color: rgba(1, 189, 170, 0.5);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24), 0 0 8px #88D5E9;
    /* box-shadow: 0 0 8px #01bdaa; */
  }

  &:disabled {
    opacity: 0.65;
    pointer-events: none;
  }

  &.${requiredClassName} {
    outline: 1px solid red !important;
  }
`


export default class TextInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  focus() {
    setTimeout(() => {this.textInput.current.focus()}, 0)
  }

  render() {
    return (
      <StyledTextInput {...this.props} ref={this.textInput} />
    );
  }
}
