import "dayjs/locale/de";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { createNewEntry, deleteEntryById } from "./backend/recordManipulation";
import { dayRecordAtom, isLoggedInAtom, readModeAtom, selectedDayAtom } from "./atoms";
import { isTokenValid } from "./backend/auth";
import { loginContainerAnimation, mainLayoutContainerAnimation } from "./animations";
import { useRecoilState, useRecoilValue } from "recoil";
import Editor from "./components/editor/editor";
import Highlights from "./components/highlights/highlights";
import Login from "./components/login/login";
import Navigation from "./components/navigation/navigation";
import React, { useEffect, useState } from "react";
import Sidebar from "./components/sidebar/sidebar";
import dayjs from "dayjs";
import posed, { PoseGroup } from "react-pose";
import styled from "styled-components";

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
    dayjs.locale("de"); // use locale globally

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
    // clear current dayRecord and remove token when the user logs off
    if (!isLoggedIn && jwtChecked) {
      setDayRecord(null);
      localStorage.removeItem("token");
    };
  }, [isLoggedIn, setDayRecord, jwtChecked]);

  const createNewEntryForSelectedDay = async () => {
    const response = await createNewEntry({
      assigned_day: dayjs(selectedDay).format("YYYY-MM-DD"),
      content: `<h1>${dayjs(selectedDay).format("dddd, D. MMMM YYYY")}</h1><hr><p></p>`,
      tags: []
    });

    if (response.status === 200) {
      setReadMode(false);
      setDayRecord(response.data);
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

      <PoseGroup style={{ width: "100%", height: "100%" }}>
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
              setHighlightsView={() => setShowHighlights(!showHighlights)}
              isCreateButtonVisible={!dayRecord}
              createNewEntry={() => createNewEntryForSelectedDay()}
              deleteEntry={() => deleteEntryFromSelectedDay()}
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
