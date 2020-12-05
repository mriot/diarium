import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { faMapMarkerAlt, faBiohazard, faLock, faTheaterMasks, faCross, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Tag from "./tag";
import { WHITE } from "../../themes/diarium-theme";
import { updateExistingEntryById } from "../../backend/recordManipulation";
import { useRecoilValue, useRecoilState } from "recoil";
import { readModeAtom, dayRecordAtom } from "../../atoms";

const rotate = keyframes`
  from {
    transform: rotate(0)
  }
  to {
    transform: rotate(360deg)
  }
`;

const TagEditorContainer = styled.div`
  color: ${WHITE};
  width: 100%;
  padding: 10px 0;
  box-sizing: border-box;
  border-bottom: 1px solid #191919;
  box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`;
const Heading = styled.h3`
  margin: 0 0 10px;
  padding-left: 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid #191919;
`;
const Spinner = styled(FontAwesomeIcon)`
  opacity: ${props => (props.spinning ? 1 : 0)};
  font-size: 16px;
  margin-left: 5px;
  transition-delay: 100ms;
  animation: 1s ${rotate} linear infinite;
`;
const TagContainer = styled.div` 
  display: grid;
  grid-gap: 3px;
  grid-template-columns: repeat(2, 1fr);
`;

export default function TagEditor(props) {
  const [checkboxDisabled, setCheckboxDisabled] = useState(true);
  const [spinnerActive, setSpinnerActive] = useState(false);
  const readMode = useRecoilValue(readModeAtom);
  const [dayRecord, setDayRecord] = useRecoilState(dayRecordAtom);
  const definedTags = {
    highlight: { label: "Highlight", icon: faTheaterMasks },
    vacation: { label: "Urlaub", icon: faMapMarkerAlt },
    sick: { label: "Krank", icon: faBiohazard },
    nsfw: { label: "NSFW", icon: faLock },
    rip: { label: "RIP", icon: faCross }
  };

  useEffect(() => {
    setCheckboxDisabled(readMode);
  }, [readMode]);

  const _updateSelectedTags = async (newSelectedTags) => {
    const response = await updateExistingEntryById(dayRecord.entry_id, { tags: newSelectedTags });

    if (response.status === 200) {
      setDayRecord(response.data);
    } else {
      toast.error("Die Tags konnten leider nicht geupdated werden... 😟");
    }

    setSpinnerActive(false);
  };

  const addToSelectedTags = (tag) => {
    if (spinnerActive) return;
    setSpinnerActive(true);

    _updateSelectedTags([...dayRecord.tags, tag]);
  };

  const removeFromSelectedTags = (tag) => {
    if (spinnerActive) return;
    setSpinnerActive(true);

    _updateSelectedTags(dayRecord.tags.filter(oldTag => oldTag !== tag));
  };

  const selectedTags = dayRecord ? dayRecord.tags : [];

  return (
    <TagEditorContainer>
      <Heading>
          Tags <Spinner icon={faSyncAlt} spinning={spinnerActive ? 1 : 0} />
      </Heading>
      <TagContainer>
        {Object.keys(definedTags).map((tag, index) => (
          <Tag
            key={index}
            value={tag}
            label={definedTags[tag].label}
            icon={definedTags[tag].icon}
            disabled={checkboxDisabled}
            defaultChecked={selectedTags ? selectedTags.some(sTag => sTag === tag) : false}
            addToSelectedTags={newTag => addToSelectedTags(newTag)}
            removeFromSelectedTags={oldTag => removeFromSelectedTags(oldTag)}
          />
        ))}
      </TagContainer>
    </TagEditorContainer>
  );
}

TagEditor.propTypes = {};

TagEditor.defaultProps = {};
