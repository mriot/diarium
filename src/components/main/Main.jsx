import PropTypes from "prop-types";
import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { readModeAtom } from "../../atoms";
import Content from "./Content";
import Editor from "./editor/Editor";

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
  const readMode = useRecoilValue(readModeAtom);

  return (
    <MainView>
      {readMode ? <Content /> : <Editor />}
    </MainView>
  );
}
