import "../../themes/calendar-eros.scss";
import "react-calendar/dist/Calendar.css";
import { Calendar as ReactCalendar } from "react-calendar";
import { Redirect } from "react-router-dom";
import { dayRecordAtom, isLoadingAtom, readModeAtom, selectedDayAtom } from "../../atoms";
import { fetchHolidays } from "../../lib/external";
import { getRecordForDay, getRecordsInRange } from "../../backend/getters";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";

const StyledCalendar = styled(ReactCalendar)`
  border-bottom: 1px solid #191919;
  box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`;

export default function Calendar() {
  const readMode = useRecoilValue(readModeAtom);
  const [selectedDay, setSelectedDay] = useRecoilState(selectedDayAtom);
  const setDayRecord = useSetRecoilState(dayRecordAtom);
  const setIsLoading = useSetRecoilState(isLoadingAtom);
  const [fetchedEntries, setFetchedEntries] = useState(null);
  const [fetchedHolidays, setFetchedHolidays] = useState(null);

  useEffect(() => {
    const dateFromUrl = dayjs(window.location.pathname, "YYYY/MM/DD");
    setSelectedDay(dateFromUrl.isValid() ? dateFromUrl.toDate() : dayjs().toDate());

    return () => {
      // todo: cleanup: unlisten for history changes
    };
  }, [setSelectedDay]);

  // load data related to currently selected day
  useEffect(() => {
    if (!selectedDay) return;
    setIsLoading(true);

    // range start and end dates -> 7 days +- offset
    const start = dayjs(selectedDay).startOf("month").subtract(7, "days").format("YYYY-MM-DD");
    const end = dayjs(selectedDay).endOf("month").add(7, "days").format("YYYY-MM-DD");

    Promise.all([
      getRecordForDay(...dayjs(selectedDay).format("YYYY-MM-DD").split("-")),
      getRecordsInRange(start, end, ["assigned_day", "tags"]),
      fetchHolidays(dayjs(selectedDay).format("YYYY"))
    ]).then(([dayRecord, recordsInRange, holidays]) => {
      setDayRecord(dayRecord.data);
      setFetchedEntries(recordsInRange.data);
      setFetchedHolidays(holidays);

      setIsLoading(false);
    });
  }, [selectedDay, setDayRecord, setIsLoading]);

  if (!selectedDay) return null;
  return (
    <>
      <Redirect push to={`/${dayjs(selectedDay).format("YYYY/MM/DD")}`} />

      <StyledCalendar
        className="calendar-dark-theme"
        key="diarium_calendar_key"
        value={selectedDay}
        activeStartDate={selectedDay}
        minDetail={!readMode ? "month" : "decade"}
        minDate={!readMode ? dayjs(selectedDay).toDate() : null}
        maxDate={!readMode ? dayjs(selectedDay).toDate() : null}
        tileDisabled={() => !readMode}
        tileClassName={({ activeStartDate, date, view }) => {
          if (view !== "month") return false;
          if (!fetchedEntries || !fetchedHolidays) return false;

          // classnames from tags
          const tileClassNames = fetchedEntries.entries?.flatMap(entry =>
            dayjs(date).isSame(entry.assigned_day)
              ? [...entry.tags, "marked"]
              : []
          );

          // add holiday class if date happens to be a holiday
          if (fetchedHolidays[dayjs(date).format("YYYY-MM-DD")]) tileClassNames.push("holiday");

          return tileClassNames;
        }}

        // VALUE CHANGED (day selected)
        onChange={newValue => {
          setSelectedDay(newValue);
        }}

        // ARROW NAVIGATION
        onActiveStartDateChange={({ activeStartDate, view }) => {
          if (view !== "month") return;
          setSelectedDay(activeStartDate); // select first day of month
        }}

        // onClickDay={(...args) => console.log("onClickDay", ...args)}
        // onClickMonth={(...args) => console.log("onClickMonth", ...args)}
        // onClickYear={(...args) => console.log("onClickYear", ...args)}
      />
    </>
  );
}

Calendar.propTypes = {};
