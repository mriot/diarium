import React from 'react';
import styled from "styled-components";


const StyledSelect = styled.select`
	appearance: none;
  color: #5C5C5C;
  outline: none;
  border: none;
  border-radius: 3px;
  text-shadow: 0px 1px 0 #fff;
  font-size: inherit;
  margin-top: 0;
	cursor: pointer;
	line-height: 1.2;
	padding: 7px 23px 7px 10px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
	background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIxMDI0IiB3aWR0aD0iNzY3LjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMzg0bDM4My43NSAzODMuNzVMNzY3LjUgMzg0SDB6Ii8+PC9zdmc+") transparent no-repeat;
	background-color: #fff;
	background-size: 10px;
	background-position: 95% center;
	transition: border 0.3s, box-shadow 0.2s, color 0.5s;

  &:focus {
    border-color: rgba(1, 189, 170, 0.5);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24), 0 0 8px #88D5E9;
    /* box-shadow: 0 0 8px #01bdaa; */
  }

  &:disabled {
    opacity: 0.65;
    pointer-events: none;
  }
`

export default class Select extends React.PureComponent {
  render() {
    return (
			<StyledSelect {...this.props}>
				{this.props.children}
			</StyledSelect>
    );
  }
}
