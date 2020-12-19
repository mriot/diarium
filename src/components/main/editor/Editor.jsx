import { Editor as TinyEditor } from "@tinymce/tinymce-react";
import PropTypes from "prop-types";
import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { ALIGNMENT_BUTTON, CUSTOM_EMOJIS, EXPORTHTML_BUTTON, LIST_BUTTON, TIMEDIVIDER_BUTTON } from "./editor_extensions";
import AutoSave from "./AutoSave";
import { useRecoilState, useSetRecoilState } from "recoil";
import { dayRecordAtom, readModeAtom, sharedAutoSaverAtom } from "../../../atoms";
import { updateExistingEntryById } from "../../../backend/recordManipulation";
import SaveStatusText from "./SaveStatusText";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import DayRating from "./DayRating";

dayjs.extend(relativeTime);

const EditorRoot = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export default function Editor(props) {
  const [editorState, setEditorState] = useState(null);
  const [dayRecord, setDayRecord] = useRecoilState(dayRecordAtom);
  const [saveStatusText, setSaveStatusText] = useState("");
  const [editorReady, setEditorReady] = useState(false);
  const setSharedAutoSaver = useSetRecoilState(sharedAutoSaverAtom);

  const autoSaver = useMemo(() => {
    return new AutoSave(editorState, async (content) => {
      const response = await updateExistingEntryById(dayRecord.entry_id, { content });
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

  return (
    <EditorRoot>
      {editorReady && (
        <>
          <DayRating rating={dayRecord.day_rating} />
          <SaveStatusText text={saveStatusText} />
        </>
      )}

      <TinyEditor
        apiKey="adfvxug5xcx5iley920j6gbywuhg4260ocmpzbckdako4w6p"
        onInit={() => {
          // hack to prevent error in tinymce
          setTimeout(() => setEditorReady(true));
        }}
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
          draggable_modal: true,
          browser_spellcheck: true,
          custom_undo_redo_levels: 50,
          toolbar_mode: "sliding",
          auto_focus: true,
          emoticons_append: CUSTOM_EMOJIS(),
          content_style: `
            .mce-time-separator {
              display: flex;
              align-items: center;
              text-align: center;
              font-size: 24px;
              font-weight: bold;
            }
            .mce-time-separator::before, .mce-time-separator::after {
                content: '';
                flex: 1;
                border-bottom: 1px solid #000;
            }
            .mce-time-separator::before {
                margin-right: .25em;
            }
            .mce-time-separator::after {
                margin-left: .25em;
            }
          `,

          plugins: [
            "anchor", "autolink", "help", "paste", "print",
            "searchreplace", "wordcount", "preview", "fullscreen",
            "codesample", "hr", "image", "link", "lists",
            "table", "emoticons", "media", "textpattern"
          ],

          setup: (editor) => {
            setEditorState(editor);

            editor.ui.registry.addSplitButton("custom_alignment", ALIGNMENT_BUTTON(editor));
            editor.ui.registry.addSplitButton("custom_lists", LIST_BUTTON(editor));
            editor.ui.registry.addButton("timedivider", TIMEDIVIDER_BUTTON(editor, dayjs));
            editor.ui.registry.addMenuItem("exporthtml", EXPORTHTML_BUTTON(editor, dayRecord));
          },

          textpattern_patterns: [
            { start: "*", end: "*", format: "italic" },
            { start: "**", end: "**", format: "bold" },

            { start: "h1.", format: "h1" },
            { start: "h2. ", format: "h2" },
            { start: "h3. ", format: "h3" },

            { start: "1. ", cmd: "InsertOrderedList" },
            { start: "- ", cmd: "InsertUnorderedList" },

            { start: "---", replacement: "<hr/>" }
          ],

          menu: {
            font: {
              title: "Font",
              items: "fontsizes lineheight fontformats"
            },
            misc: {
              title: "Misc",
              items: "codesample codeformat anchor"
            },
            editor: {
              title: "Editor",
              items: "fullscreen print exporthtml"
            }
          },

          menubar: "font table misc editor",

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
                "timedivider",
                "hr",
                "link",
                "emoticons",
                "image",
                "media"
              ]
            },
            {
              name: "indentation",
              items: [
                "custom_alignment",
                "custom_lists",
                "outdent",
                "indent",
                "blockquote"
              ]
            },
            { name: "misc", items: ["removeformat", "help"] }
          ],

          block_formats: `
            Paragraph=p;
            Heading 1=h1;
            Heading 2=h2;
            Heading 3=h3;
            Preformatted=pre;
          `.trim() // only to support template literals here ¯\_(ツ)_/¯
        }}
      />
    </EditorRoot>
  );
};

Editor.propTypes = {};
