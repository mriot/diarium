import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Calendar as ReactCalendar } from "react-calendar";
import moment from "moment";
import { toast } from "react-toastify";
import { Redirect, withRouter } from "react-router-dom";
import "../../themes/calendar-eros.css";
import { fetchHolidays } from "../../lib/external";
import { getRecordsInRange, getRecordForDay } from "../../lib/backend";
import { useRecoilState, useRecoilValue } from "recoil";
import { dayRecordAtom, readModeAtom, selectedDayAtom } from "../../atoms";

const StyledCalendar = styled(ReactCalendar)`
  border-bottom: 1px solid #191919;
  box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`;

export default function Calendar() {
  const readMode = useRecoilValue(readModeAtom);
  const [selectedDay, setSelectedDay] = useRecoilState(selectedDayAtom);
  const [dayRecord, setDayRecord] = useRecoilState(dayRecordAtom);
  const [fetchedEntries, setFetchedEntries] = useState(null);
  const [fetchedHolidays, setFetchedHolidays] = useState(null);
  const [forceUpdateCalendar, setForceUpdateCalendar] = useState(0);

  useEffect(() => {
    const dateFromUrl = moment(window.location.pathname, "YYYY/MM/DD");
    console.log(dateFromUrl);
    setSelectedDay(dateFromUrl.isValid() ? dateFromUrl.toDate() : moment().toDate());

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
    // NOTE: using moment() on the date because startOf/endOf would mutate the state object
    const start = moment(selectedDay).startOf("month").subtract(7, "days").format("YYYY-MM-DD");
    const end = moment(selectedDay).endOf("month").add(7, "days").format("YYYY-MM-DD");

    (async function fetchDayRecord() {
      const record = await getRecordForDay(
        moment(selectedDay).format("YYYY"),
        moment(selectedDay).format("MM"),
        moment(selectedDay).format("DD")
      );

      setDayRecord(record);
      // todo: error handling?
    })();

    (async function fetchDayRecordsInCalendarRange() {
      const records = await getRecordsInRange(start, end, ["assignedDay", "tags"]);

      setFetchedEntries(records);
      // todo: error handling?
    })();

    (async function fetchHolidaysForYear() {
      const records = await fetchHolidays(moment(selectedDay).format("YYYY"));

      setFetchedHolidays(records);
      // todo: error handling?
    })();

    // todo: hide loading bar when all finished
  }, [selectedDay]);

  const resetCalendarToToday = (today = moment().toDate()) => {
    // don't reset calendar, while in editmode
    if (!readMode) return;

    // todo: show loading bar

    setForceUpdateCalendar(Math.random());
    setSelectedDay(today);
  };

  if (!selectedDay) return null;
  return (
    <>
      <Redirect push to={`/${moment(selectedDay).format("YYYY/MM/DD")}`} />

      <StyledCalendar
        className="calendar-dark-theme"
        key="diarium_calendar_key"
        value={selectedDay}
        forceUpdateCalendar={forceUpdateCalendar}
        minDetail={!readMode ? "month" : "decade"}
        minDate={!readMode ? moment(selectedDay).toDate() : null}
        maxDate={!readMode ? moment(selectedDay).toDate() : null}
        tileDisabled={() => !readMode}
        tileClassName={({ activeStartDate, date, view }) => {
          if (view !== "month") return false;
          if (!fetchedEntries || !fetchedHolidays) return false;

          const currentTilesDate = moment(date).format("YYYY-MM-DD");

          // global dayRecord (via context) did change — e.g. created
          if (dayRecord && moment(currentTilesDate).isSame(dayRecord.assignedDay)) {
            return [...dayRecord.tags, "marked"].flat(Infinity);
          }

          const { entries } = fetchedEntries;
          const holidays = fetchedHolidays;
          const classNamesArray = [];

          // date found as key in holidays — congrats, it's a holiday
          if (holidays[moment(date).format("YYYY-MM-DD")]) classNamesArray.push("holiday");

          // generate classnames from tags
          classNamesArray.push(
            entries?.map(entry => {
              return moment(currentTilesDate).isSame(entry.assignedDay) ? [...entry.tags, "marked"] : [];
            })
          );

          return classNamesArray.flat(Infinity);
        }}

        // ARROW NAVIGATION
        onActiveDateChange={changeObj => {
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
