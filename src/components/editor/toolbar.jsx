import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAltH, faBold, faCode, faColumns, faCompress, faDivide, faExpand, faFont, faImage, faItalic, faLink, faListOl, faListUl, faMinus, faRemoveFormat, faReply, faRulerHorizontal, faShare, faUnderline, faUndoAlt, faVihara } from "@fortawesome/free-solid-svg-icons";
import { toolbarItemsAnimation } from "./animations";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import posed from "react-pose";
import styled from "styled-components";

const StyledToolbar = styled.div`
  width: 100%;
  height: 35px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  background-color: #efefef;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
  user-select: none;
  box-sizing: border-box;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  
  ${props => props.toolbarStatus.zenModeActive && `
    border-radius: 0;
    border-bottom: none;
  `}
`;

const LeftSide = styled.aside`
  display: flex;
  align-items: center;
`;

const RightSide = styled.aside`
  display: flex;
  align-items: center;
`;

const PosedButtonSeparator = posed.div(toolbarItemsAnimation);
const ButtonSeparator = styled(PosedButtonSeparator)`
  width: 2px;
  height: 60%;
  margin: 0 5px;
  background-color: #c7c7c7;
`;

const PosedIconButton = posed.div(toolbarItemsAnimation);
const IconButton = styled(PosedIconButton)`
  position: relative;
  padding: 6px 10px;
  line-height: 1;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 3px;
  color: #1f222a;

  &:hover {
    background-color: #c7c7c7;
  }

  ${props => props.isActive && `
    background-color: #c7c7c7;
  `}

  ${props => props.isDisabled && `
    color: #777;
    pointer-events: none;
  `}
`;

const SaveStatusText = styled.div`
  margin-left: 5px;
  color: #777;
`;

export default function Toolbar(props) {
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [readMode, setReadMode] = useState(false); // TODO: useRecoilState

  const toolbarItems = {
    left: [],

    right: [
      {
        title: "Zen-Mode",
        onClick: () => props.toggleZenMode(),
        isActive: () => props.toolbarStatus.zenModeActive,
        icon: faVihara
      },
      {
        title: "Vollbild",
        onClick: () => {
          toggleFullScreen();
          // if (!readMode) props.editorFocus(); // TODO: implement editor focus
        },
        isActive: () => fullscreenMode,
        icon: fullscreenMode ? faCompress : faExpand
      }
    ]
  };

  useEffect(() => {
    // set the correct state if the user exits fullscreen by pressing the ESC key
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) setFullscreenMode(false);
    });
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(
        setFullscreenMode(true)
      );
    } else if (document.exitFullscreen) {
      document.exitFullscreen().then(
        setFullscreenMode(false)
      );
    }
  };

  return (
    <StyledToolbar {...props} id="lorem">
      <LeftSide>
        {toolbarItems.left.map((item, index) => [
          !item.separator && (
            <IconButton
              key={index}
              pose={readMode ? "hide" : "show"}
              title={item.title}
              onClick={item.onClick}
              isActive={item.isActive && item.isActive()}
              isDisabled={item.isDisabled && item.isDisabled()}
            >
              <FontAwesomeIcon icon={item.icon} />
            </IconButton>
          ), // <- we're in an array

          item.separator && <ButtonSeparator key={index} pose={readMode ? "hide" : "show"} />
        ])}

        <SaveStatusText>
          {props.toolbarStatus.saveStatusText}
        </SaveStatusText>
      </LeftSide>

      <RightSide>
        {toolbarItems.right.map((item, index) => (
          <IconButton
            key={index}
            pose={item.hiddenInReadMode && readMode ? "hide" : "show"}
            title={item.title}
            onClick={item.onClick}
            isActive={item.isActive && item.isActive()}
          >
            <FontAwesomeIcon icon={item.icon} />
          </IconButton>
        ))}
      </RightSide>
    </StyledToolbar>
  );
}
