import "dayjs/locale/de";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { dayRecordAtom, isLoggedInAtom } from "./atoms";
import { isTokenValid } from "./backend/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import Login from "./components/login/login";
import Navigation from "./components/navigation/navigation";
import React, { useEffect, useState } from "react";
import Sidebar from "./components/sidebar/sidebar";
import dayjs from "dayjs";
import styled from "styled-components";
import Main from "./components/main/Main";

const Layout = styled.div`
  position: relative;
  max-height: 100vh;
  height: 100vh;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
`;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const setDayRecord = useSetRecoilState(dayRecordAtom);
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
  }, [setIsLoggedIn]);

  useEffect(() => {
    if (isLoggedIn !== undefined) setJwtChecked(true);
    // clear current dayRecord and remove token when the user logs off
    if (!isLoggedIn && jwtChecked) {
      setDayRecord(null);
      localStorage.removeItem("token");
    };
  }, [isLoggedIn, setDayRecord, jwtChecked]);

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

      {!isLoggedIn && (
        <div style={{ height: "100%" }}>
          <Redirect to="/login" />
          <Route path="/login" exact>
            <Login />
          </Route>
        </div>
      )}

      {isLoggedIn && (
        <Layout>
          <Navigation/>

          <Sidebar/>

          <Main/>
        </Layout>
      )}

      <ToastContainer
        // hideProgressBar={true}
        position="bottom-right"
        autoClose={10000}
        newestOnTop
        style={{
          right: 0
        }}
      />
    </BrowserRouter>
  );
}
