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
import React, { useEffect, useState } from "react";
import Toolbar from "./toolbar";
import posed from "react-pose";
import styled from "styled-components";
import {
  GET_ALIGNMENT_BUTTON_CONFIG,
  GET_INLINECODE_BUTTON_CONFIG,
  GET_LIST_BUTTON_CONFIG
} from "./_custom";
import AutoSave from "./AutoSave";
import { useRecoilState, useRecoilValue } from "recoil";
import { dayRecordAtom, readModeAtom } from "../../atoms";
import parse from "html-react-parser";
import { updateExistingEntryById } from "../../backend/recordManipulation";
import root from "react-shadow";

const PosedEditorContainer = posed.div(editorAnimation);
const EditorContainer = styled(PosedEditorContainer)`
  display: flex;
  width: 100%;
  height: 100%;
  color: #fff;
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
  const [editorState, setEditorState] = useState(null);
  const [dayRecord, setDayRecord] = useRecoilState(dayRecordAtom);
  const readMode = useRecoilValue(readModeAtom);
  const [localState, setLocalState] = useState({
    zenMode: false,
    saveStatusText: ""
  });

  const autoSaver = new AutoSave(editorState, async (content) => {
    // todo: save status text: Saving...
    // todo: handle backend save
    // todo: handle editor dirty (set to false when save was successful)
    // todo: save status text: Saved! (if successful)
    // todo: save status text: Error! (if not successful)

    const response = await updateExistingEntryById(dayRecord.entry_id, { content });
    console.log(response);
    if (response.ok) {
      setDayRecord(response.data);
    }

    console.log("Saved!");
  });

  useEffect(() => {
    console.log("Editor state", editorState);
  }, [editorState]);

  return (
    <EditorContainer
      pose={props.pose}
      isZenModeActive={false}
    >
      <Toolbar
        toolbarStatus={{
          zenModeActive: false,
          saveStatusText: "okay"
        }}
      />

      <div style={{
        display: "flex",
        fontSize: "14px"
      }}>
        <button onClick={() => autoSaver.start(0)}>save now</button>
        <button onClick={() => console.log(editorState)}>log editor state</button>
        <button onClick={() => console.log(editorState.getContent())}>log editor content</button>
      </div>

      {readMode && (
        <root.div>
          {dayRecord && parse(dayRecord?.content)}
        </root.div>
      )}

      {!readMode && (
        <TinyEditor
          apiKey="adfvxug5xcx5iley920j6gbywuhg4260ocmpzbckdako4w6p"
          initialValue={dayRecord?.content}
          onEditorChange={() => autoSaver.start()}
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
            branding: true,
            contextmenu: false,
            toolbar_sticky: true,
            browser_spellcheck: true,
            custom_undo_redo_levels: 50,

            plugins: [
              "anchor", "autolink", "help", "paste", "print",
              "searchreplace", "wordcount", "preview",
              // formatting
              "codesample", "hr", "image", "link", "lists", "table"
            ],

            setup: (editor) => {
              setEditorState(editor);

              editor.addShortcut("Meta+S", "Save editor content", () => autoSaver.start(0));

              editor.ui.registry.addSplitButton("alignment", GET_ALIGNMENT_BUTTON_CONFIG(editor));
              editor.ui.registry.addSplitButton("custom_lists", GET_LIST_BUTTON_CONFIG(editor));
              editor.ui.registry.addToggleButton("inlinecode", GET_INLINECODE_BUTTON_CONFIG(editor));
            },

            menu: {
              font: {
                title: "Font",
                items: "fontformats fontsizes lineheight"
              },
              misc: {
                title: "Misc",
                items: "codesample codeformat anchor | print"
              }
            },

            menubar: "font table misc help",

            toolbar: [
              { name: "history", items: ["undo", "redo"] },
              { name: "format", items: ["formatselect"] },
              {
                name: "style",
                items: [
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "forecolor",
                  "backcolor"
                ]
              },
              {
                name: "media",
                items: [
                  "hr",
                  "link",
                  "image"
                  // "table",
                  // "inlinecode",
                  // "codesample"
                ]
              },
              {
                name: "indentation",
                items: [
                  "alignment",
                  "custom_lists",
                  "outdent",
                  "indent"
                ]
              },
              { name: "misc", items: ["removeformat"] }
            ],

            block_formats: `
              Paragraph=p;
              Heading 1=h1;
              Heading 2=h2;
              Heading 3=h3;
              Preformatted=pre;` // ! it doesn't work for some reason when the backtick is on the next line
          }}
        />
      )}
    </EditorContainer>
  );
};
