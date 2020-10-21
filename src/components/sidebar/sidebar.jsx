import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import moment from "moment";
import Progress from "./progress";
import Calendar from "./calendar";
import Loadingbar from "../common/loadingbar";
import TagEditor from "./tag-editor";
import MetaData from "./meta-data";
import { WHITE } from "../../themes/diarium-theme";

const StyledSidebar = styled.aside`
  position: relative;
  width: 300px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  box-sizing: border-box;
  background-color: #20232a;
`;
const Today = styled.div`
  color: ${WHITE};
  font-size: 18px;
  padding: 10px;
  cursor: pointer;
  text-align: center;

  &:hover {
    text-decoration: underline;
  }
`;

export default function Sidebar(props) {
  const [dateToday, setDateToday] = useState(moment());
  const [loadingbar, setLoadingbar] = useState(false);
  const [forceReset, setForceReset] = useState(0);

  useEffect(() => {
    // run "today updater" each minute
    setInterval(() => {
      if (moment(dateToday).diff(moment(), "days") > 0) {
        console.log("'todaysDate' is one day behind — updating...");
        setDateToday(moment());
      }
    }, 1000 * 60); // 1 min

    // check date after user inactivity ended
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && moment(dateToday).diff(moment(), "days") > 0) {
        console.log("'todaysDate' is one day behind — updating...");
        setDateToday(moment());
      }
    });
  }, []);

  return (
    <StyledSidebar>
      <Today onClick={() => {
        setForceReset(forceReset + 1);
        setDateToday(moment());
      }}
      >
        {moment(dateToday).format("dddd, D. MMMM YYYY")}
      </Today>

      <Loadingbar active={loadingbar} />

      <Calendar
        forceReset={forceReset}
        showLoadingbar={status => setLoadingbar(status)}
      />

      <TagEditor />

      <MetaData />

      <Progress />
    </StyledSidebar>
  );
}

Sidebar.propTypes = {};
