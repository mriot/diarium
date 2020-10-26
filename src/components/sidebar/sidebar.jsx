import { WHITE } from "../../themes/diarium-theme";
import { selectedDayAtom } from "../../atoms";
import { useSetRecoilState } from "recoil";
import Calendar from "./calendar";
import Loadingbar from "../common/loadingbar";
import MetaData from "./meta-data";
import Progress from "./progress";
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

export default function Sidebar() {
  const [dateToday, setDateToday] = useState(dayjs());
  const setSelectedDay = useSetRecoilState(selectedDayAtom);

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
  }, [dateToday]);

  return (
    <StyledSidebar>
      <Today onClick={() => setSelectedDay(new Date())}>
        {dayjs(dateToday).format("dddd, D. MMMM YYYY")}
      </Today>

      <Loadingbar />

      <Calendar />

      <TagEditor />

      <MetaData />

      <Progress />
    </StyledSidebar>
  );
}

Sidebar.propTypes = {};
