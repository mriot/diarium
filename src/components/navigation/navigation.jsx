import { faFire, faMap, faPen, faPlusSquare, faSignOutAlt, faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { isLoggedInAtom, readModeAtom, showHeatmapAtom } from "../../atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import NavButton from "./nav-button";
import PropTypes from "prop-types";
import React from "react";
import Search from "./search";
import styled from "styled-components";

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
  /* margin-right: 20px; */
`;
const Separator = styled.div`
  width: 2px;
  align-self: stretch;
  margin: 5px 0;
  background-color: #414247;
`;

export default function Navigation(props) {
  const [readMode, setReadMode] = useRecoilState(readModeAtom);
  const [showHeatmap, setShowHeatmap] = useRecoilState(showHeatmapAtom);
  const setIsLoggedIn = useSetRecoilState(isLoggedInAtom);

  return (
    <Nav>
      <Logo>DIARIUM</Logo>
      <RightSide>
        <ButtonContainer>
          {!props.isCreateButtonVisible && !readMode && (
            <NavButton
              icon={faTrash}
              onClick={() => {
                if (prompt(
                  // eslint-disable-next-line prefer-template
                  "Bist du dir sicher, dass du diesen Eintrag löschen möchtest? 😐\n" +
                  "Gib zum Bestätigen bitte 'ok' ein"
                ) === "ok") {
                  this.props.deleteEntry();
                }
              }}
            />
          )}
          {!props.isCreateButtonVisible && (
            <NavButton
              value="Bearbeiten"
              icon={faPen}
              active={!readMode}
              onClick={() => {
                setReadMode(!readMode);
                // todo: change view to editor (e.g. close highlights)
              }}
            />
          )}
          {props.isCreateButtonVisible && (
            <NavButton
              value="Erstellen"
              icon={faPlusSquare}
              onClick={() => {
                props.createNewEntry();
                // todo: change view to editor (e.g. close highlights)
              }}
            />
          )}
          <NavButton
            value="Heatmap"
            icon={faFire}
            active={showHeatmap}
            onClick={() => setShowHeatmap(!showHeatmap)}
          />
          <NavButton
            value="Highlights"
            icon={faStar}
            active={props.isHighlightsViewActive}
            onClick={() => {
              props.setHighlightsView(!props.isHighlightsViewActive);
              if (!props.isHighlightsViewActive) setReadMode(true);
            }}
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

Navigation.propTypes = {
  isHighlightsViewActive: PropTypes.bool.isRequired,
  setHighlightsView: PropTypes.func.isRequired,
  isCreateButtonVisible: PropTypes.bool.isRequired,
  createNewEntry: PropTypes.func.isRequired,
  deleteEntry: PropTypes.func.isRequired
};
