import { WHITE } from "../../themes/diarium-theme";
import Calendar from "./calendar";
import Loadingbar from "../common/loadingbar";
import MetaData from "./meta-data";
import Progress from "./progress";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import TagEditor from "./tag-editor";
import dayjs from "dayjs";
import styled from "styled-components";

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
  const [dateToday, setDateToday] = useState(dayjs());
  const [loadingbar, setLoadingbar] = useState(false);
  const [forceReset, setForceReset] = useState(0);

  useEffect(() => {
    // run "today updater" each minute
    setInterval(() => {
      if (dayjs(dateToday).diff(dayjs(), "days") > 0) {
        console.log("'todaysDate' is one day behind — updating...");
        setDateToday(dayjs());
      }
    }, 1000 * 60); // 1 min

    // check date after user inactivity ended
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && dayjs(dateToday).diff(dayjs(), "days") > 0) {
        console.log("'todaysDate' is one day behind — updating...");
        setDateToday(dayjs());
      }
    });
  }, []);

  return (
    <StyledSidebar>
      <Today onClick={() => {
        setForceReset(forceReset + 1);
        setDateToday(dayjs());
      }}
      >
        {dayjs(dateToday).format("dddd, D. MMMM YYYY")}
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
