import React from "react";
import styled from "styled-components";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import posed, { PoseGroup } from "react-pose";
import moment from "moment";
import Navigation from "./components/navigation/navigation";
import Sidebar from "./components/sidebar/sidebar";
import Editor from "./components/editor/editor";
import Highlights from "./components/highlights/highlights";
import "moment/locale/de";
import Login from "./components/login/login";
import { isLoggedIn, createNewEntry } from "./lib/backend";
import { GlobalContext } from "./contexts";
import { mainLayoutContainerAnimation, loginContainerAnimation } from "./animations";

const PosedLayout = posed.div(mainLayoutContainerAnimation);
const Layout = styled(PosedLayout) `
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
`;
const LoginContainer = posed.div(loginContainerAnimation);
export default class App extends React.PureComponent {
	constructor(props) {
		super(props);

		moment().locale("de");

		this.state = {
			readMode: true,
			showHighlights: false,
			loggedIn: false,
			tokenChecked: false,
			dayRecord: null,
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
		this.setState({ loggedIn: status, tokenChecked: true });
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
						readMode: false,
						dayRecord: result.body,
					});
				}
			});
	}
  
	render() {
		const {
			tokenChecked, loggedIn, dayRecord,
			readMode, showHighlights,
		} = this.state;

		// prevent flashing '/login' in URL on page load when user is logged in
		if (!tokenChecked) return null;

		return (
			<BrowserRouter>
				<PoseGroup>
					{!loggedIn && (
						<LoginContainer key="posed-login-container-771634">
							<Redirect to="/login" />
							<Route path="/login" exact>
								<Login setLoggedIn={status => this.setLoggedIn(status)} />
							</Route>
						</LoginContainer>
					)}

					{loggedIn && (
						<Layout key="posed-layout-831276">
							<GlobalContext.Provider value={{
								GLOBAL_DAYRECORD: dayRecord,
								GLOBAL_READMODE: readMode,
								UPDATE_GLOBAL_DAYRECORD: newDayRecord => this.setState({ dayRecord: newDayRecord }),
							}}
							>
								<Navigation
									isReadModeActive={readMode}
									setReadMode={bool => this.setState({ readMode: bool })}
									isHighlightsViewActive={showHighlights}
									setHighlightsView={bool => this.setState({ showHighlights: bool })}
									setLoggedIn={bool => this.setLoggedIn(bool)}
									isCreateButtonVisible={!dayRecord}
									createNewEntry={() => this.createNewEntryForSelectedDay()}
								/>

								<Sidebar
									isReadModeActive={readMode}
								/>

								<Main>
									<PoseGroup>
										{showHighlights && (
											<Highlights key="highlights" />
										)}
									</PoseGroup>

									<Editor
										isReadModeActive={readMode}
										pose={showHighlights ? "hidden" : "visible"}
									/>
								</Main>
							</GlobalContext.Provider>
						</Layout>
					)}
				</PoseGroup>

				{loggedIn && (
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
