import React from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
// import { auth } from "../../lib/backend";
import TextInput from "../common/textinput";
import Button from "../common/button";
import { auth } from "../../lib/backend";

const LoginMaskWrapper = styled.div `
  width: 100%;
  height: 100%;
  display: flex;
  align-items: baseline;
  justify-content: center;
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

const Row = styled.div `
  margin: 5px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: ${props => (props.alignedRight ? "flex-end" : "space-between")};
`;

const Heading = styled.h1 `
	color: #353a47;
	font-size: 40px;
	letter-spacing: 2px;
	margin: 15px;
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

	handleKeyStrokes(nativeEvent) {
		// enter key
		if (nativeEvent.which === 13) {
			this.doLogin();
		}
	}

	doLogin() {
		auth(this.username, this.password)
			.then(response => {
				this.props.setLoggedIn(true);
			})
			.catch(error => {
				console.log(error);
				this.setState(prevState => ({ loginFailed: prevState.loginFailed + 1 }));
			});
	}

	render() {
		return (
			<LoginMaskWrapper>
				<LoginMask>
					<Row style={{
						margin: "0 auto 30px"
					}}
					>
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
					<Row style={{
						marginBottom: "25px"
					}}
					>
						<Label>Passwort:</Label>
						<TextInput
							light
							type="password"
							onChange={event => (this.password = event.currentTarget.value)}
							onKeyPress={event => this.handleKeyStrokes(event.nativeEvent)}
						/>
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
			</LoginMaskWrapper>
		);
	}
}

Login.propTypes = {
	setLoggedIn: PropTypes.func.isRequired,
	
};