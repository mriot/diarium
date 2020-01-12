import React from "react";
import styled from "styled-components";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PoseGroup } from "react-pose";
import moment from "moment";
import Navigation from "./components/navigation/navigation";
import Sidebar from "./components/sidebar/sidebar";
import Editor from "./components/editor/editor";
import Highlights from "./components/highlights/highlights";
import "moment/locale/de";
import Login from "./components/login/login";
import { isLoggedIn } from "./lib/backend";

const Layout = styled.div `
  position: relative;
  max-height: 100vh;
  height: 100vh;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
`;
const Main = styled.main `
  position: relative;
  overflow-x: hidden;
  height: 100%;
  /* perspective: 1000px; */
`;

export default class App extends React.PureComponent {
	constructor(props) {
		super(props);

		moment().locale("de");

		this.state = {
			readMode: false,
			showHighlights: false,
			isLoggedIn: false,
			tokenChecked: false,
			dayRecord: {},
		};
	}

	componentDidMount() {
		this.setLoggedIn(isLoggedIn());
	}

	setLoggedIn(status) {
		this.setState({ isLoggedIn: status, tokenChecked: true });
	}
  
	render() {
		// prevent flashing '/login' in URL on page load when user is logged in
		if (!this.state.tokenChecked) return null;

		return (
			<BrowserRouter>
				{!this.state.isLoggedIn && (
					<>
						<Redirect to="/login" />
						<Route path="/login" exact>
							<Login setLoggedIn={status => this.setLoggedIn(status)} />
						</Route>
					</>
				)}

				{this.state.isLoggedIn && (
					<Layout>
						<Navigation
							isReadModeActive={this.state.readMode}
							setReadMode={bool => this.setState({ readMode: bool })}
							isHighlightsViewActive={this.state.showHighlights}
							setHighlightsView={bool => this.setState({ showHighlights: bool })}
							setLoggedIn={bool => this.setLoggedIn(bool)}
						/>

						<Sidebar
							isReadModeActive={this.state.readMode}
							getDayRecord={record => this.setState({ dayRecord: record })}
						/>

						<Main>
							<PoseGroup>
								{this.state.showHighlights &&
								<Highlights key="highlights" />}
							</PoseGroup>

							<Editor
								isReadModeActive={this.state.readMode}
								pose={this.state.showHighlights ? "hidden" : "visible"}
								dayRecord={this.state.dayRecord}
							/>
						</Main>
					</Layout>
				)}

				{this.state.isLoggedIn && (
					<Switch>
						<Redirect from="/login" to="/" exact />
					</Switch>
				)}

				<ToastContainer
					position="bottom-left"
					// hideProgressBar={true}
					// autoClose={5000}
					newestOnTop
					progressStyle={{ background: "linear-gradient(to right, #00b7ff, #5ac8fa, #007aff, #34aadc)" }}
					style={{
						left: 0
					}}
				/>
			</BrowserRouter>
		);
	}
}
