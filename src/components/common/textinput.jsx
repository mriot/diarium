import React from 'react';
import styled from "styled-components";

const StyledTextInput = styled.input `
  color: #9e9e9e;
  outline: none;
  border: none;
  border-radius: 3px;
  font-size: inherit;
  margin-top: 0;
  padding: 7px 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background-color: rgba(100, 100, 100, 0.5);
  transition: border 0.3s, box-shadow 0.2s, color 0.5s;

  &::placeholder {
    color: #9e9e9e;
  }
  
  &:focus {
    box-shadow: inset 0 0 0 1px #555;
  }

  &:disabled {
    opacity: 0.65;
    pointer-events: none;
  }
`

export default class TextInput extends React.PureComponent {
  constructor(props) {
    super(props);

    this.textInputRef = React.createRef();
  }

  render() {
    return (
      <StyledTextInput {...this.props} ref={this.textInputRef} />
    );
  }
}
