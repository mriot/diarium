import PropTypes from "prop-types";
import React from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { readModeAtom } from "../../atoms";
import Content from "./Content";
import Editor from "./editor/Editor";
import { useHotkeys } from "react-hotkeys-hook";

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
  overflow-x: hidden;
`;

export default function Main() {
  const [readMode, setReadMode] = useRecoilState(readModeAtom);

  useHotkeys("e", () => {
    if (readMode) setReadMode(false);
  });

  return (
    <MainView>
      {readMode ? <Content /> : <Editor />}
    </MainView>
  );
}
