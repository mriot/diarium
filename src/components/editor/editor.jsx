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
import React, { useEffect, useState, useMemo } from "react";
import posed from "react-pose";
import styled from "styled-components";
import {
  GET_ALIGNMENT_BUTTON_CONFIG,
  GET_LIST_BUTTON_CONFIG
} from "./_custom";
import AutoSave from "./AutoSave";
import { useRecoilState, useSetRecoilState } from "recoil";
import { dayRecordAtom, readModeAtom, sharedAutoSaverAtom } from "../../atoms";
import { updateExistingEntryById } from "../../backend/recordManipulation";
import root from "react-shadow/styled-components";
import SaveStatusText from "./SaveStatusText";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Content from "./Content";
import { useHotkeys } from "react-hotkeys-hook";

dayjs.extend(relativeTime);

const PosedEditorContainer = posed.div(editorAnimation);
const EditorContainer = styled(PosedEditorContainer)`
  display: flex;
  width: 100%;
  height: 100%;
  color: #fff;
  position: relative;
  background-color: #20232a;
  flex-direction: column;
  transform-origin: center;
  backface-visibility: hidden;
`;

export default function Editor(props) {
  const [editorState, setEditorState] = useState(null);
  const [dayRecord, setDayRecord] = useRecoilState(dayRecordAtom);
  const [readMode, setReadMode] = useRecoilState(readModeAtom);
  const [saveStatusText, setSaveStatusText] = useState("");
  const setSharedAutoSaver = useSetRecoilState(sharedAutoSaverAtom);

  const autoSaver = useMemo(() => {
    return new AutoSave(editorState, async (content) => {
      const response = await updateExistingEntryById(dayRecord.entry_id, { content });
      // console.log(response);
      if (response.status === 200) {
        setDayRecord(response.data);
        setSaveStatusText("Gespeichert " + dayjs(response.data.updated_at).fromNow());
        editorState.save();
        return true;
      }

      setSaveStatusText("Error!" + response.status);
    });
  }, [dayRecord, editorState, setDayRecord]);

  useEffect(() => {
    setSharedAutoSaver(autoSaver);

    if (editorState) {
      editorState.addShortcut("Meta+S", "Save editor content", () => {
        autoSaver.saveNow();
      });
    }
  }, [autoSaver, editorState, setSharedAutoSaver]);

  useHotkeys("e", () => {
    if (dayRecord && readMode) setReadMode(false);
  }, {}, [dayRecord, readMode]);

  return (
    <EditorContainer pose={props.pose}>
      {readMode && (
        <root.div>
          {
            <Content>
              {dayRecord ? dayRecord?.content : (`
                <h1 style='margin: 25% auto; text-align:center;'>
                  Wow, such empty
                  <p>🌚</p>
                </h1>
              `)}
            </Content>
          }
        </root.div>
      )}

      {!readMode && (
        <>
          <SaveStatusText text={saveStatusText} />

          <TinyEditor
            apiKey="adfvxug5xcx5iley920j6gbywuhg4260ocmpzbckdako4w6p"
            initialValue={dayRecord?.content}
            onEditorChange={(content, editor) => {
              if (autoSaver.isEditorDirty()) {
                autoSaver.scheduleSave();
                setSaveStatusText("Saving changes...");
              }
            }}
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
              auto_focus: true,

              plugins: [
                "anchor", "autolink", "help", "paste", "print",
                "searchreplace", "wordcount", "preview", "fullscreen",
                "codesample", "hr", "image", "link", "lists",
                "table", "emoticons"
              ],

              setup: (editor) => {
                setEditorState(editor);
                // editor.focus();

                editor.ui.registry.addSplitButton("custom_alignment", GET_ALIGNMENT_BUTTON_CONFIG(editor));
                editor.ui.registry.addSplitButton("custom_lists", GET_LIST_BUTTON_CONFIG(editor));
              },

              emoticons_append: {
                shrug: {
                  keywords: ["shrug"],
                  char: "¯\\_(ツ)_/¯"
                }
              },

              menu: {
                font: {
                  title: "Font",
                  items: "fontformats fontsizes lineheight"
                },
                misc: {
                  title: "Misc",
                  items: "codesample codeformat anchor | fullscreen print"
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
                    "image",
                    "emoticons"
                  ]
                },
                {
                  name: "indentation",
                  items: [
                    "custom_alignment",
                    "custom_lists",
                    "blockquote",
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
        </>
      )}
    </EditorContainer>
  );
};

Editor.propTypes = {
  pose: PropTypes.string
};
