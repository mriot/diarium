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
import Content from "../Content";
import { useHotkeys } from "react-hotkeys-hook";
import DayRating from "../DayRating";
import { isDayRecordReady, isEmptyObject } from "../../../lib/utils";

const MainView = styled.div`
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

export default function Main() {
  return (
    <MainView>

    </MainView>
  );
}
