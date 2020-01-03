import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faStarAndCrescent, faStar, faPen } from "@fortawesome/free-solid-svg-icons";
import NavButton from "./nav-button";
import TextInput from "../common/textinput";

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
  margin-right: 20px;
`;
const Separator = styled.div `
  width: 2px;
  align-self: stretch;
  margin: 7px 5px 7px 20px;
  background-color: rgba(255, 255, 255, 0.5);
`;
const LogoutButton = styled.div `
  color: #9e9e9e;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    color: orangered;
  }
`;

export default class Navigation extends React.PureComponent {
	render() {
		return (
			<Nav>
				<Logo>DIARIUM</Logo>
				<RightSide>
					<ButtonContainer>
						<NavButton
							value="Bearbeiten"
							icon={faPen}
							active={!this.props.isReadModeActive}
							onClick={() => {
								this.props.setReadMode(!this.props.isReadModeActive);
								if (this.props.isReadModeActive) this.props.setHighlightsView(false);
							}}
						/>
						<NavButton
							value="Highlights"
							icon={faStar}
							active={this.props.isHighlightsViewActive}
							onClick={() => {
								this.props.setHighlightsView(!this.props.isHighlightsViewActive);
								if (!this.props.isHighlightsViewActive) this.props.setReadMode(true);
							}}
						/>
					</ButtonContainer>

					<TextInput placeholder="Suchen..." />

					<Separator />
          
					<LogoutButton>
						<FontAwesomeIcon icon={faSignOutAlt} />
					</LogoutButton>
				</RightSide>
			</Nav>
		);
	}
}

Navigation.propTypes = {
	isReadModeActive: PropTypes.bool,
	setReadMode: PropTypes.func,
	isHighlightsViewActive: PropTypes.bool,
	setHighlightsView: PropTypes.func,
};
