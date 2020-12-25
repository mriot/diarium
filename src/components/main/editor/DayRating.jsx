import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useState } from "react/cjs/react.development";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { dayRecordAtom, showHeatmapAtom } from "../../../atoms";
import { updateExistingEntryById } from "../../../backend/recordManipulation";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { isDayRecordReady } from "../../../lib/utils";

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
    display: flex;
    border: 1px solid #ccc;
    border-radius: 3px;
    background-color: #fff;
    box-shadow: 0 4px 8px 0 rgba(34,47,62,.1);
  }
`;

const ColorTile = styled.div`
  && {
    width: 30px;
    height: 30px;
    color: transparent;
    display: flex;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    transition: all 150ms;

    ${props => props.active ? "&" : "&:hover"} {
      color: #fff;
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
  const [rating, setRating] = useState(props.rating ?? null);
  const [dayRecord, setDayRecord] = useRecoilState(dayRecordAtom);
  const setShowHeatmap = useSetRecoilState(showHeatmapAtom);
  const pickerRef = useRef(null);
  useOutsideClick(pickerRef, (event) => {
    if (isMenuOpen) setIsMenuOpen(false);
  });

  useEffect(() => {
    setShowHeatmap(isMenuOpen);

    return () => {
      setShowHeatmap(false);
    };
  }, [isMenuOpen, setShowHeatmap]);

  return (
    NODE && ReactDOM.createPortal(
      <StyledDayRating
        ref={isMenuOpen ? pickerRef : null}
        className="tox-mbtn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        Day Rating
        <ColorPreview color={COLORS[rating]?.color ?? "#fff"} />
        {isMenuOpen && (
          <ColorPicker>
            {COLORS.map((item, index) =>
              <ColorTile
                key={index}
                title={item.title}
                style={{ backgroundColor: item.color }}
                active={index === rating}
                onClick={(event) => {
                  event.stopPropagation();

                  if (index !== rating && isDayRecordReady(dayRecord)) {
                    setRating(index);
                    updateExistingEntryById(dayRecord.entry_id, {
                      rating: index
                    }).then(res => {
                      setDayRecord(res.data);
                    }).catch(err => alert(err));
                  }
                }}
              >
                {index}
              </ColorTile>
            )}
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
