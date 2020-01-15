import React from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndoAlt, faColumns, faImage, faLink, faCode, faExpand, faCompress, faShare, faReply, faVihara, faArrowsAltH } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import TextInput from "../common/textinput";
import Button from "../common/button";
import { auth } from "../../lib/backend";
import Select from "../common/select";

const LoginMaskContainer = styled.div `
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
	justify-content: center;
	flex-direction: column;
`;

const LoginMask = styled.div `
  display: flex;
  flex-direction: column;
  padding: 50px;
  margin-top: 100px;
  border-radius: 3px;
  background-color: #ddd;
  box-shadow: 0 20px 20px -5px rgba(0, 0, 0, 0.3), 0 -10px 20px -5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
`;

const LoginFooter = styled.div `
	width: auto;
	color: #ddd;
	display: flex;
	justify-content: space-between;

	a {
		color: #ddd;
	}
`;

const Row = styled.div `
  margin: 5px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: ${props => (props.alignedRight ? "flex-end" : "space-between")};
`;

const Heading = styled.h1 `
	color: #353a47;
	font-size: 45px;
	letter-spacing: 2px;
	margin: 0 5px 5px;
`;

const shakeAnimation = keyframes `
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
  80% {
    transform: translateX(3px);
  }
  90% {
    transform: translateX(-3px);
  }
`;

const ErrorMessage = styled.span `
  color: #a94442;
  background-color: #f2dede;
  border: 1px solid #ebccd1;
  border-radius: 3px;
  padding: 5px 10px;
  width: 100%;
  text-align: center;
  animation: ${shakeAnimation} 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
`;

const Label = styled.span `
  margin-right: 10px;
`;

export default class Login extends React.PureComponent {
	constructor(props) {
		super(props);
    
		this.username = "";
		this.password = "";

		this.state = {
			loginFailed: 0
		};
	}

	componentDidMount() {
		if (!localStorage.getItem("federal_state")) {
			localStorage.setItem("federal_state", "HE");
		}
	}
	
	handleKeyStrokes(nativeEvent) {
		// enter key
		if (nativeEvent.which === 13) {
			this.doLogin();
		}
	}

	doLogin() {
		auth(this.username, this.password)
			.then(response => {
				if (!response) {
					this.setState(prevState => ({ loginFailed: prevState.loginFailed + 1 }));
					return;
				}
				this.props.setLoggedIn(true);
			})
			.catch(error => {
				console.log(error);
			});
	}

	render() {
		return (
			<LoginMaskContainer>
				<div>
					<LoginMask>
						<Row style={{ margin: "0 auto 30px" }}>
							<Heading>DIARIUM</Heading>
						</Row>
						<Row>
							<Label>Benutzername:</Label>
							<TextInput
								light
								onChange={event => (this.username = event.currentTarget.value)}
								onKeyPress={event => this.handleKeyStrokes(event.nativeEvent)}
							/>
						</Row>
						<Row>
							<Label>Passwort:</Label>
							<TextInput
								light
								type="password"
								onChange={event => (this.password = event.currentTarget.value)}
								onKeyPress={event => this.handleKeyStrokes(event.nativeEvent)}
							/>
						</Row>
						<Row style={{ marginBottom: "25px" }}>
							<Label
								title="Nur um dir die richtigen Feiertage anzeigen zu können. =)"
								style={{ cursor: "help" }}
							>
							Bundesland: <span role="img" aria-label="warum?">🤔</span>?
							</Label>
							<Select
								defaultValue={localStorage.getItem("federal_state") || "HE"}
								onChange={event => {
									localStorage.setItem("federal_state", event.currentTarget.value);
								}}
							>
								<option value="BB">Brandenburg</option>
								<option value="BE">Berlin</option>
								<option value="BW">Baden-Württemberg</option>
								<option value="BY">Bayern</option>
								<option value="HB">Bremen</option>
								<option value="HE">Hessen</option>
								<option value="HH">Hamburg</option>
								<option value="MV">Mecklenburg-Vorpommern</option>
								<option value="NI">Niedersachsen</option>
								<option value="NW">Nordrhein-Westfalen</option>
								<option value="RP">Rheinland-Pfalz</option>
								<option value="SH">Schleswig-Holstein</option>
								<option value="SL">Saarland</option>
								<option value="SN">Sachsen</option>
								<option value="ST">Sachsen-Anhalt</option>
								<option value="TH">Thüringen</option>
							</Select>
						</Row>
						{this.state.loginFailed > 0 && (
							<Row key={this.state.loginFailed}>
								<ErrorMessage>
                Anmeldedaten fehlerhaft.
								</ErrorMessage>
							</Row>
						)}
						<Row alignedRight>
							<Button onClick={() => this.doLogin()}>
              Einloggen
							</Button>
						</Row>
					</LoginMask>
					{/* <LoginFooter>
						<span>by mriot</span>
						<a href="https://github.com/mriot/diarium">
							<FontAwesomeIcon icon={faGithub} />
						</a>
					</LoginFooter> */}
				</div>
			</LoginMaskContainer>
		);
	}
}

Login.propTypes = {
	setLoggedIn: PropTypes.func.isRequired,
};
