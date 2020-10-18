import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import posed, { PoseGroup } from "react-pose";
import moment from "moment";
import Navigation from "./components/navigation/navigation";
import Sidebar from "./components/sidebar/sidebar";
import Editor from "./components/editor/editor";
import Highlights from "./components/highlights/highlights";
import "moment/locale/de";
import Login from "./components/login/login";
import { isTokenValid } from "./backend/auth";
import { mainLayoutContainerAnimation, loginContainerAnimation } from "./animations";
import { useRecoilState, useRecoilValue } from "recoil";
import { dayRecordAtom, isLoggedInAtom, readModeAtom, selectedDayAtom } from "./atoms";
import { createNewEntry, deleteEntryById } from "./backend/recordManipulation";

const PosedLayout = posed.div(mainLayoutContainerAnimation);
const Layout = styled(PosedLayout)`
  position: relative;
  max-height: 100vh;
  height: 100vh;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
`;
const Main = styled.main`
  position: relative;
  overflow-x: hidden;
  height: 100%;
`;
const LoginContainer = posed.div(loginContainerAnimation);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const selectedDay = useRecoilValue(selectedDayAtom);
  const [readMode, setReadMode] = useRecoilState(readModeAtom);
  const [dayRecord, setDayRecord] = useRecoilState(dayRecordAtom);
  const [showHighlights, setShowHighlights] = useState(false);
  const [jwtChecked, setJwtChecked] = useState(false);

  useEffect(() => {
    // set default locale of momentjs
    moment().locale("de");

    // wether the user is logged in when the component mounts
    setIsLoggedIn(isTokenValid());

    // check login status after user inactivity ended
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        setIsLoggedIn(isTokenValid());
      }
    });
  }, []);

  useEffect(() => {
    if (isLoggedIn !== undefined) setJwtChecked(true);
    // clear current dayRecord when the user logs off
    if (!isLoggedIn) setDayRecord(null);
  }, [isLoggedIn]);

  const createNewEntryForSelectedDay = async () => {
    const result = await createNewEntry({
      assignedDay: moment(selectedDay).format("YYYY-MM-DD"),
      content: `<h1>${selectedDay.format("dddd, D. MMMM YYYY")}</h1>\n\n`,
      contentType: "text/html",
      tags: []
    });

    if (result.ok) {
      setReadMode(false);
      setDayRecord(result.body);
    }
  };

  const deleteEntryFromSelectedDay = async () => {
    // NOTE: security check is made on button press in <Navigation />
    if (!dayRecord) return false;
    const result = await deleteEntryById(dayRecord.id);

    if (result.error) {
      toast.error(`Der Eintrag konnte nicht gelöscht werden. 🙈 Der Server antwortete mit: ${result.error}`);
      console.error(result.error);
      return false;
    }

    toast.info("Der Eintrag wurde gelöscht! 💀");
    console.log("The deleted entry:", result);
    setReadMode(true);
    setDayRecord(null);
    return true;
  };

  // show nothing until token has been checked
  // also prevents flashing '/login' in URL on page load when user is already logged in
  if (!jwtChecked) return null;

  return (
    <BrowserRouter>
      {isLoggedIn && (
        <Switch>
          <Redirect from="/login" to="/" exact />
        </Switch>
      )}

      <PoseGroup>
        {!isLoggedIn && (
          <LoginContainer key="posed-login-container-771634">
            <Redirect to="/login" />
            <Route path="/login" exact>
              <Login />
            </Route>
          </LoginContainer>
        )}

        {isLoggedIn && (
          <Layout key="posed-layout-831276">
            <Navigation
              isHighlightsViewActive={showHighlights}
              setHighlightsView={bool => this.setState({ showHighlights: bool })}
              isCreateButtonVisible={!dayRecord}
              createNewEntry={() => this.createNewEntryForSelectedDay()}
              deleteEntry={() => this.deleteEntryFromSelectedDay()}
            />

            <Sidebar/>

            <Main>
              <PoseGroup withParent={false}>
                {showHighlights && (
                  <Highlights key="highlights" />
                )}
              </PoseGroup>

              <Editor pose={showHighlights ? "hidden" : "visible"} />
            </Main>
          </Layout>
        )}
      </PoseGroup>

      <ToastContainer
        // hideProgressBar={true}
        position="bottom-right"
        autoClose={10000}
        newestOnTop
        progressStyle={{ background: "linear-gradient(to right, #00b7ff, #5ac8fa, #007aff, #34aadc)" }}
        style={{
          right: 0
        }}
      />
    </BrowserRouter>
  );
}
