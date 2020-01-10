import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyledSelect = styled.select `
  appearance: none;
  width: 55%;
  color: #000;
  outline: none;
  border: none;
  border-radius: 3px;
  font-size: inherit;
  margin-top: 0;
  padding: 7px 14px;
  padding-right: 25px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
	cursor: pointer;
  box-sizing: border-box;
  text-shadow: 0px 1px 0 #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
	background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSIxMDI0IiB3aWR0aD0iNzY3LjUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMzg0bDM4My43NSAzODMuNzVMNzY3LjUgMzg0SDB6Ii8+PC9zdmc+") transparent no-repeat;
	background-color: #eee;
  background-size: 10px;
	background-position: 95% center;
  transition: border 0.3s, box-shadow 0.2s, color 0.5s;

  &::placeholder {
    color: #9e9e9e;
  }
  
  &:focus {
    box-shadow: 0 0 0 1px #555;
  }

  &:disabled {
    opacity: 0.65;
    pointer-events: none;
  }
`;

export default class Select extends React.PureComponent {
	render() {
		return (
			<StyledSelect {...this.props}>
				{this.props.children}
			</StyledSelect>
		);
	}
}

Select.propTypes = {
	children: PropTypes.any,
};
