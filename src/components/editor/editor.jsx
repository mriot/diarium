import "../../themes/draftjs-ceres.css";
import "draft-js/dist/Draft.css";
import { Editor as DraftEditor, EditorState, RichUtils } from "draft-js";
import { editorAnimation } from "./animations";
import PropTypes from "prop-types";
import React, { useState } from "react";
import Toolbar from "./toolbar";
import posed from "react-pose";
import styled from "styled-components";

const PosedEditorContainer = posed.div(editorAnimation);
const EditorContainer = styled(PosedEditorContainer)`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  flex-direction: column;
  transform-origin: center;
  backface-visibility: hidden;

  ${props => props.isZenModeActive && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  `}
`;

export default function Editor(props) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [localState, setLocalState] = useState({
    zenMode: false,
    editorHistory: { undo: 0, redo: 0 },
    saveStatusText: ""
  });

  const _onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };
  const _onItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  };
  const _onUnderlineClick = () => {
    console.log("underline");
    setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  };

  return (
    <EditorContainer
      pose={props.pose}
      isZenModeActive={false}
    >
      <Toolbar
        boldClick={_onBoldClick}
        italicClick={_onItalicClick}
        underlineClick={_onUnderlineClick}
        toolbarStatus={{
          readModeActive: false,
          zenModeActive: false,
          editorHistory: { undo: 0, redo: 0 },
          saveStatusText: "okay"
        }}
      />

      <DraftEditor
        editorState={editorState}
        onChange={val => setEditorState(val)}
      />
    </EditorContainer>
  );
};
