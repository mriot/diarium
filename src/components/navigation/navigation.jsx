import { faFire, faPen, faPlusSquare, faSignOutAlt, faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { dayRecordAtom, isLoggedInAtom, readModeAtom, sharedAutoSaverAtom, showHeatmapAtom } from "../../atoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import NavButton from "./nav-button";
import PropTypes from "prop-types";
import React from "react";
import Search from "./search";
import styled from "styled-components";
import useDeleteEntry from "../../hooks/useDeleteEntry";
import useCreateEntry from "../../hooks/useCreateEntry";
import { isEmptyObject } from "../../lib/utils";

const Nav = styled.nav`
  width: 100%;
  height: auto;
  padding: 5px;
  display: flex;
  position: relative;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  background-color: #20232a;
  border-bottom: 1px solid #191919;
  box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
  grid-column: 1/3;
`;
const Logo = styled.span`
  color: #fff;
  font-size: 24px;
  z-index: 1;
`;
const RightSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;
const ButtonContainer = styled.div`
  position: relative;
  display: flex;
`;
const Separator = styled.div`
  width: 2px;
  align-self: stretch;
  margin: 5px 0;
  background-color: #414247;
`;

export default function Navigation() {
  const [readMode, setReadMode] = useRecoilState(readModeAtom);
  const [showHeatmap, setShowHeatmap] = useRecoilState(showHeatmapAtom);
  const setIsLoggedIn = useSetRecoilState(isLoggedInAtom);
  const sharedAutoSaver = useRecoilValue(sharedAutoSaverAtom);
  const dayRecord = useRecoilValue(dayRecordAtom);
  const createEntry = useCreateEntry();
  const deleteEntry = useDeleteEntry();
  const isCreateButtonVisible = isEmptyObject(dayRecord);

  return (
    <Nav>
      <Logo>DIARIUM</Logo>
      <RightSide>
        <ButtonContainer>
          {!isCreateButtonVisible && !readMode && (
            <NavButton
              icon={faTrash}
              onClick={() => deleteEntry()}
            />
          )}
          {!isCreateButtonVisible && (
            <NavButton
              value="Bearbeiten"
              icon={faPen}
              active={!readMode}
              onClick={() => {
                if (!readMode && sharedAutoSaver.isEditorDirty()) {
                  sharedAutoSaver.saveNow();
                }
                setReadMode(!readMode);
                // todo: change view to editor (e.g. close highlights)
              }}
            />
          )}
          {isCreateButtonVisible && (
            <NavButton
              value="Erstellen"
              icon={faPlusSquare}
              onClick={() => createEntry()}
            />
          )}
          <NavButton
            value="Heatmap"
            icon={faFire}
            active={showHeatmap}
            onClick={() => setShowHeatmap(!showHeatmap)}
          />
        </ButtonContainer>

        <Search placeholder="Suchen..." />

        <Separator />

        <NavButton
          icon={faSignOutAlt}
          onClick={() => setIsLoggedIn(false)}
        />
      </RightSide>
    </Nav>
  );
}

Navigation.propTypes = {};
