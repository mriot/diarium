import "../../themes/calendar-eros.scss";
import "react-calendar/dist/Calendar.css";
import { Calendar as ReactCalendar } from "react-calendar";
import { Redirect, useHistory, withRouter } from "react-router-dom";
import { dayRecordAtom, readModeAtom, selectedDayAtom } from "../../atoms";
import { fetchHolidays } from "../../lib/external";
import { getRecordForDay, getRecordsInRange } from "../../backend/getters";
import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue } from "recoil";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";

const StyledCalendar = styled(ReactCalendar)`
  border-bottom: 1px solid #191919;
  box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`;

export default function Calendar(props) {
  const readMode = useRecoilValue(readModeAtom);
  const [selectedDay, setSelectedDay] = useRecoilState(selectedDayAtom);
  const [dayRecord, setDayRecord] = useRecoilState(dayRecordAtom);
  const [fetchedEntries, setFetchedEntries] = useState(null);
  const [fetchedHolidays, setFetchedHolidays] = useState(null);
  const [forceUpdateCalendar, setForceUpdateCalendar] = useState(0);

  useEffect(() => {
    const dateFromUrl = dayjs(window.location.pathname, "YYYY/MM/DD");
    setSelectedDay(dateFromUrl.isValid() ? dateFromUrl.toDate() : dayjs().toDate());

    // todo listen for history changes
    /*
    const historyUnlisten = props.history.listen((location, action) => {
      const parsedDate = moment(location.pathname, "YYYY/MM/DD");
      if (parsedDate.isSame(this.state.selectedDay)) return;

      // parse date from URL — fallback is current date
      this.setState({ selectedDay: parsedDate.isValid() ? parsedDate.toDate() : moment().toDate() });
    });
    */

    return () => {
      // todo: cleanup: unlisten for history changes
    };
  }, []);

  useEffect(() => {
    if (!selectedDay) return;

    // todo: show loading bar
    const start = dayjs(selectedDay).startOf("month").subtract(7, "days").format("YYYY-MM-DD");
    const end = dayjs(selectedDay).endOf("month").add(7, "days").format("YYYY-MM-DD");

    (async function fetchDayRecord() {
      const response = await getRecordForDay(
        dayjs(selectedDay).format("YYYY"),
        dayjs(selectedDay).format("MM"),
        dayjs(selectedDay).format("DD")
      );
      setDayRecord(response.data);
      // todo: error handling?
    })();

    (async function fetchDayRecordsInCalendarRange() {
      const response = await getRecordsInRange(start, end, ["assigned_day", "tags"]);

      setFetchedEntries(response.data);
      // todo: error handling?
    })();

    (async function fetchHolidaysForYear() {
      const holidays = await fetchHolidays(dayjs(selectedDay).format("YYYY"));

      setFetchedHolidays(holidays);
      // todo: error handling?
    })();

    // todo: hide loading bar when all finished
  }, [selectedDay, setDayRecord]);

  useEffect(() => {
    // don't reset calendar, while in editmode
    if (!readMode) return;

    // todo: show loading bar

    setForceUpdateCalendar(Math.random());
    setSelectedDay(dayjs().toDate());
  }, [readMode, setSelectedDay]);

  /*
  const resetCalendarToToday = (today = moment().toDate()) => {
    // don't reset calendar, while in editmode
    if (!readMode) return;

    // todo: show loading bar

    setForceUpdateCalendar(Math.random());
    setSelectedDay(today);
  };
  */

  if (!selectedDay) return null;
  return (
    <>
      <Redirect push to={`/${dayjs(selectedDay).format("YYYY/MM/DD")}`} />

      <StyledCalendar
        className="calendar-dark-theme"
        key="diarium_calendar_key"
        value={selectedDay}
        forceUpdateCalendar={forceUpdateCalendar}
        minDetail={!readMode ? "month" : "decade"}
        minDate={!readMode ? dayjs(selectedDay).toDate() : null}
        maxDate={!readMode ? dayjs(selectedDay).toDate() : null}
        tileDisabled={() => !readMode}
        tileClassName={({ activeStartDate, date, view }) => {
          if (view !== "month") return false;
          if (!fetchedEntries || !fetchedHolidays) return false;

          const currentTilesDate = dayjs(date).format("YYYY-MM-DD");

          // global dayRecord did change
          if (dayRecord && dayjs(currentTilesDate).isSame(dayRecord.assigned_day)) {
            return [...dayRecord.tags, "marked"].flat(Infinity);
          }

          const { entries } = fetchedEntries;
          const holidays = fetchedHolidays;
          const classNamesArray = [];

          // date found as key in holidays -> holiday
          if (holidays[dayjs(date).format("YYYY-MM-DD")]) classNamesArray.push("holiday");

          // generate classnames from tags
          classNamesArray.push(
            entries?.map(entry => {
              return dayjs(currentTilesDate).isSame(entry.assigned_day) ? [...entry.tags, "marked"] : [];
            })
          );

          return classNamesArray.flat(Infinity);
        }}

        // ARROW NAVIGATION
        onActiveStartDateChange={changeObj => {
          // todo: show loading bar
          const { activeStartDate, view } = changeObj;
          if (view !== "month") return;

          // select first day of month
          setSelectedDay(activeStartDate);
        }}

        // MONTH SELECTED
        onClickMonth={activeStartDate => {
          // todo: show loading bar

          // select first day of month
          setSelectedDay(activeStartDate);
        }}

        // DATE/DAY SELECTED (fetch selected day -> all data)
        onClickDay={activeStartDate => {
          // todo: show loading bar

          setSelectedDay(activeStartDate);
        }}

        // YEAR SELECTOR
        // onClickYear={(...args) => console.log("onClickYear", ...args)}

        // GENERAL CHANGE LISTENER
        // onChange={value => console.log("onChange:", value)}
      />
    </>
  );
}

Calendar.propTypes = {
  forceReset: PropTypes.number
};
