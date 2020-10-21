import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StyledTag = styled.div`
  position: relative;
  user-select: none;
  align-items: center;
  line-height: 2;
  color: ${props => (props.checked && "#00ff8b") || (props.disabled && "#aaa")};
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  border-radius: 50px;
  font-size: 15px;
  transform-origin: left;
  padding: 0 5px;
  transition: all 100ms;

  &:${props => !props.disabled && "hover"} {
    background-color: rgba(0, 0, 0, 0.2);

    span, svg {
      transform: scale(1.15);
    }
  }
`;
const Icon = styled(FontAwesomeIcon)`
  width: 15% !important;
  margin-right: 7px;
  transform-origin: left;
  transition: all 100ms;
`;
const Text = styled.span`
  display: inline-block;
  transform-origin: left;
  transition: all 100ms;
`;

export default function Tag(props) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // todo - maybe do this for initial state?
    setIsChecked(props.defaultChecked);
  }, [props.defaultChecked]);

  return (
    <StyledTag
      label={props.label}
      icon={props.icon}
      value={props.value} // that's the value we gonna write into the selectedTags array
      disabled={props.disabled}
      checked={isChecked}
      onClick={() => {
        if (props.disabled) return;

        if (!isChecked) {
          props.addToSelectedTags(props.value);
        } else {
          props.removeFromSelectedTags(props.value);
        }
      }}
    >
      <Icon icon={props.icon} />
      <Text>{props.label}</Text>
    </StyledTag>
  );
}

Tag.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  defaultChecked: PropTypes.bool.isRequired,
  addToSelectedTags: PropTypes.func.isRequired,
  removeFromSelectedTags: PropTypes.func.isRequired
};

Tag.defaultProps = {
  disabled: false
};
