// import "./LOREM/skins/ui/LOREM/skin.min.css";

// ! to load tiny locally
// import tinymce from "tinymce";
// import "tinymce/icons/default";
// import "tinymce/plugins/link";
// import "tinymce/plugins/paste";
// import "tinymce/themes/silver";
// ...
// import "tinymce/skins/ui/oxide/skin.css";

import { Editor as TinyEditor } from "@tinymce/tinymce-react";
import { editorAnimation } from "./animations";
import PropTypes from "prop-types";
import React, { useState } from "react";
import Toolbar from "./toolbar";
import posed from "react-pose";
import styled from "styled-components";
import { GET_ALIGNMENT_BUTTON_CONFIG } from "./_custom";

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
        initialValue="<h1>This is the initial content of the editor</h1>"
        onEditorChange={(val) => console.log(val)}
        init={{
          // ! settings for local skin file
          // skin: false,
          // skin_url: "LOREM",
          // content_css: "dark",

          skin: "oxide",
          // content_css: "dark",
          height: "100%",
          width: "100%",
          resize: false,
          // menubar: false,
          menubar: "insert format help",
          branding: true,
          contextmenu: false,
          toolbar_sticky: true,
          browser_spellcheck: true,
          custom_undo_redo_levels: 50,

          plugins: [
            "anchor", "autolink", "help", "paste", "print", "searchreplace", "wordcount",
            // formatting
            "codesample", "hr", "image", "link", "lists", "table"
          ],

          setup: (editor) => {
            editor.ui.registry.addSplitButton("alignment", GET_ALIGNMENT_BUTTON_CONFIG(editor));
          },

          toolbar: `
            undo redo | formatselect | 
            bold italic underline strikethrough forecolor alignment | 
            hr link image table codesample | 
            blockquote bullist numlist outdent indent | 
            removeformat | help
          `,

          block_formats: `
            Paragraph=p;
            Heading 1=h1;
            Heading 2=h2;
            Heading 3=h3;
            Preformatted=pre;` // ! it doesn't work for some reason when the backtick is on the next line
        }}
      />
    </EditorContainer>
  );
};
