// import "./LOREM/skins/ui/LOREM/skin.min.css";
import { Editor as TinyEditor } from "@tinymce/tinymce-react";
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
  const [localState, setLocalState] = useState({
    zenMode: false,
    editorHistory: { undo: 0, redo: 0 },
    saveStatusText: ""
  });

  return (
    <EditorContainer
      pose={props.pose}
      isZenModeActive={false}
    >
      <Toolbar
        toolbarStatus={{
          readModeActive: false,
          zenModeActive: false,
          editorHistory: { undo: 0, redo: 0 },
          saveStatusText: "okay"
        }}
      />

      <TinyEditor
        apiKey="adfvxug5xcx5iley920j6gbywuhg4260ocmpzbckdako4w6p"
        initialValue="<p>This is the initial content of the editor</p>"
        init={{
          height: "100%",
          skin: "oxide",
          content_css: "dark",

          // settings for local skin file
          // skin: false,
          // skin_url: "LOREM",
          // content_css: "dark",

          // statusbar: false,
          branding: false, // should become visible once the premium trial ended
          resize: false,
          menubar: false,
          // menubar: "file edit insert view format table tools help",
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount table"
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | table | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help"
        }}
        onEditorChange={(val) => console.log(val)}
      />
    </EditorContainer>
  );
};
