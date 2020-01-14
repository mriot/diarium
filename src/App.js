import React from "react";
import styled from "styled-components";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PoseGroup } from "react-pose";
import moment from "moment";
import Navigation from "./components/navigation/navigation";
import Sidebar from "./components/sidebar/sidebar";
import Editor from "./components/editor/editor";
import Highlights from "./components/highlights/highlights";
import "moment/locale/de";
import Login from "./components/login/login";
import { isLoggedIn, createNewEntry } from "./lib/backend";

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
			readMode: true,
			showHighlights: false,
			isLoggedIn: false,
			tokenChecked: false,
			dayRecord: {},
		};
	}

	componentDidMount() {
		this.setLoggedIn(isLoggedIn());
	}

	componentDidUpdate(prevProps, prevState) {
		if (!isLoggedIn()) {
			this.setLoggedIn(false);
			this.setState({ dayRecord: null });
		}
	}

	setLoggedIn(status) {
		this.setState({ isLoggedIn: status, tokenChecked: true });
	}

	createNewEntryForSelectedDay() {
		const selectedDay = moment(window.location.pathname, "YYYY/MM/DD");
		
		createNewEntry({
			assignedDay: moment(selectedDay).format("YYYY-MM-DD"),
			content: `# ${selectedDay.format("dddd, D. MMMM YYYY")}\n\n`,
			contentType: "text/markdown",
			tags: [],
		})
			.then(result => {
				if (result.ok) {
					this.setState({
						dayRecord: result.body,
						readMode: false,
					});
				}
			});
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
							isCreateButtonVisible={!this.state.dayRecord}
							createNewEntry={() => this.createNewEntryForSelectedDay()}
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
								dayRecord={this.state.dayRecord}
								isReadModeActive={this.state.readMode}
								pose={this.state.showHighlights ? "hidden" : "visible"}
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
					// hideProgressBar={true}
					position="bottom-left"
					autoClose={10000}
					newestOnTop
					progressStyle={{ background: "linear-gradient(to right, #00b7ff, #5ac8fa, #007aff, #34aadc)" }}
					style={{
						left: 0,
					}}
				/>
			</BrowserRouter>
		);
	}
}
