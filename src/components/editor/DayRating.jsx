import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react/cjs/react.development";
import styled from "styled-components";

const StyledDayRating = styled.div`
 && {
    position: relative;
    overflow: visible !important;
    padding: 0 4px;
    cursor: default;
    user-select: none;
  }
`;

const ColorPreview = styled.div`
  && {
    height: 20px;
    width: 20px;
    background-color: ${props => props.color};
    border: 1px solid #ccc;
    margin-left: 5px;
  }
`;

const ColorPicker = styled.div`
  && {
    position: absolute;
    top: 100%;
    left: 0;
    padding: 5px;

    .tox-swatch:hover {
      transform: none;
      box-shadow: inset 0 0 0 3px #fff !important;
    }
  }
`;

const COLORS = [
  { title: "Horrible", color: "#EE0000" },
  { title: "Dreadful", color: "#CC0000" },
  { title: "Really bad", color: "#990000" },
  { title: "Bad", color: "#660000" },
  { title: "OK", color: "#006600" },
  { title: "Good", color: "#009900" },
  { title: "Awesome", color: "#00CC00" },
  { title: "Phenomenal", color: "#00EE00" }
];

export default function DayRating(props) {
  const NODE = document.querySelector(".tox-menubar");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    props.rating ? COLORS[props.rating].color : "#fff"
  );

  return (
    NODE && ReactDOM.createPortal(
      <StyledDayRating className="tox-mbtn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        Day Rating
        <ColorPreview color={selectedColor} />

        {isMenuOpen && (
          <ColorPicker className="tox-menu tox-swatches-menu">
            <div className="tox-swatches__row">
              {COLORS.map((item, index) =>
                <div
                  key={index}
                  title={item.title}
                  data-mce-color={item.color}
                  role="menuitemcheckbox"
                  aria-haspopup="false"
                  tabIndex="-1"
                  className="tox-swatch"
                  aria-disabled="false"
                  aria-checked="false"
                  onClick={() => {
                    setSelectedColor(COLORS[index].color);
                  }}
                  style={{ backgroundColor: item.color }}
                />
              )}
            </div>
          </ColorPicker>
        )}
      </StyledDayRating>,
      NODE
    )
  );
}

DayRating.propTypes = {
  rating: PropTypes.number
};
