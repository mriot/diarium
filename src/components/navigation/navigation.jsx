import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faStar, faPen, faPlusSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import NavButton from "./nav-button";
import Search from "./search";

const Nav = styled.nav `
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
const Logo = styled.span `
  color: #fff;
  font-size: 24px;
  z-index: 1;
`;
const RightSide = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-around;
`;
const ButtonContainer = styled.div `
  position: relative;
  display: flex;
  /* margin-right: 20px; */
`;
const Separator = styled.div `
  width: 2px;
  align-self: stretch;
  margin: 5px 0;
  background-color: #414247;
`;

export default class Navigation extends React.PureComponent {
	logout() {
		localStorage.removeItem("token");
		this.props.setLoggedIn(false);
	}

	render() {
		const {
			isCreateButtonVisible, createNewEntry, isReadModeActive,
			setHighlightsView, setReadMode, isHighlightsViewActive,
		} = this.props;

		return (
			<Nav>
				<Logo>DIARIUM</Logo>
				<RightSide>
					<ButtonContainer>
						{!isCreateButtonVisible && !isReadModeActive && (
							<NavButton
								icon={faTrash}
								onClick={() => {
									const rand3DigitsCode = Math.floor(10 + Math.random() * 90);

									if (prompt(
										// eslint-disable-next-line prefer-template
										"Bist du dir sicher, dass du diesen Eintrag löschen möchtest? 😐\n" +
										"Gib zum Bestätigen bitte diesen Code ein: " + rand3DigitsCode
									) === String(rand3DigitsCode)) {
										// TODO: add delete function
										console.log("Delete...");
									}
								}}
							/>
						)}
						{!isCreateButtonVisible && (
							<NavButton
								value="Bearbeiten"
								icon={faPen}
								active={!isReadModeActive}
								onClick={() => {
									setReadMode(!isReadModeActive);
									if (isReadModeActive) setHighlightsView(false);
								}}
							/>
						)}
						{isCreateButtonVisible && (
							<NavButton
								value="Erstellen"
								icon={faPlusSquare}
								onClick={() => {
									createNewEntry();
									if (isReadModeActive) setHighlightsView(false);
								}}
							/>
						)}
						<NavButton
							value="Highlights"
							icon={faStar}
							active={isHighlightsViewActive}
							onClick={() => {
								setHighlightsView(!isHighlightsViewActive);
								if (!isHighlightsViewActive) setReadMode(true);
							}}
						/>
					</ButtonContainer>

					<Search placeholder="Suchen..." />

					<Separator />
          
					<NavButton
						icon={faSignOutAlt}
						onClick={() => this.logout()}
					/>
				</RightSide>
			</Nav>
		);
	}
}

Navigation.propTypes = {
	isReadModeActive: PropTypes.bool.isRequired,
	setReadMode: PropTypes.func.isRequired,
	isHighlightsViewActive: PropTypes.bool.isRequired,
	setHighlightsView: PropTypes.func.isRequired,
	setLoggedIn: PropTypes.func.isRequired,
	isCreateButtonVisible: PropTypes.bool.isRequired,
	createNewEntry: PropTypes.func.isRequired,
};
