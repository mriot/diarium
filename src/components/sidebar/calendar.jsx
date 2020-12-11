import "../../themes/calendar-eros.scss";
import "react-calendar/dist/Calendar.css";
import { Calendar as ReactCalendar } from "react-calendar";
import { Redirect, useLocation } from "react-router-dom";
import { dayRecordAtom, isLoadingAtom, readModeAtom, selectedDayAtom, showHeatmapAtom } from "../../atoms";
import { fetchHolidays } from "../../lib/external";
import { getRecordForDay, getRecordsInRange } from "../../backend/getters";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import usePrevious from "../../hooks/usePrevious";

const StyledCalendar = styled(ReactCalendar)`
  border-bottom: 1px solid #191919;
  box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`;

export default function Calendar() {
  const readMode = useRecoilValue(readModeAtom);
  const showHeatmap = useRecoilValue(showHeatmapAtom);
  const [selectedDay, setSelectedDay] = useRecoilState(selectedDayAtom);
  const [dayRecord, setDayRecord] = useRecoilState(dayRecordAtom);
  const setIsLoading = useSetRecoilState(isLoadingAtom);
  const [fetchedEntries, setFetchedEntries] = useState(null);
  const [fetchedHolidays, setFetchedHolidays] = useState(null);
  const prevSelectedDay = usePrevious(selectedDay);
  const location = useLocation();

  useEffect(() => {
    const dateFromUrl = dayjs(location.pathname, "YYYY/MM/DD");
    setSelectedDay(dateFromUrl.isValid() ? dateFromUrl.toDate() : dayjs().toDate());
  }, [setSelectedDay, location]);

  // SELECTED DAY
  useEffect(() => {
    if (!selectedDay) return;
    if (dayjs(selectedDay).isSame(prevSelectedDay)) return;

    (async () => {
      const response = await getRecordForDay(...dayjs(selectedDay).format("YYYY-MM-DD").split("-"));
      setDayRecord(response.data);
    })();
  }, [prevSelectedDay, selectedDay, setDayRecord]);

  // MONTH OVERVIEW
  useEffect(() => {
    if (!selectedDay) return;
    if (dayjs(selectedDay).isSame(prevSelectedDay)) return;

    const start = dayjs(selectedDay).startOf("month").subtract(7, "days").format("YYYY-MM-DD");
    const end = dayjs(selectedDay).endOf("month").add(7, "days").format("YYYY-MM-DD");

    (async () => {
      const response = await getRecordsInRange(start, end, ["assigned_day", "tags", "day_rating"]);
      setFetchedEntries(response.data.entries);
    })();
  }, [prevSelectedDay, selectedDay]);

  // HOLIDAYS
  useEffect(() => {
    if (!selectedDay) return;
    if (dayjs(selectedDay).isSame(prevSelectedDay, "year")) return;

    (async () => {
      const response = await fetchHolidays(dayjs(selectedDay).format("YYYY"));
      setFetchedHolidays(response);
    })();
  }, [prevSelectedDay, selectedDay]);

  if (!selectedDay) return null;
  return (
    <>
      <Redirect push to={`/${dayjs(selectedDay).format("YYYY/MM/DD")}`} />

      <StyledCalendar
        className={["calendar-dark-theme", showHeatmap ? "day-rating-enabled" : ""]}
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

          const tileClassNames = [];

          // add holiday class if date happens to be a holiday
          if (fetchedHolidays[dayjs(date).format("YYYY-MM-DD")]) {
            tileClassNames.push("holiday");
          }

          let tileMatchingEntry;
          // use actual entry (if available) because it's likely always up to date
          if (dayRecord && dayjs(date).isSame(dayRecord.assigned_day)) {
            tileMatchingEntry = dayRecord;
          } else {
            // find entry that matches current tiles date
            tileMatchingEntry = fetchedEntries.find(entry =>
              dayjs(date).isSame(entry.assigned_day)
            );
          }

          // if no matching entry found, return here as there is nothing else to do
          if (!tileMatchingEntry) return tileClassNames;

          // apply tags as classnames (+ 'marked'-class as this day has content)
          tileClassNames.push(...tileMatchingEntry.tags, "marked");

          /** only apply day-rating classes for the current month
           * this may change in the future
           * problem is the reduced opacity for neighboring months which falsifies the colors
          */
          if (tileMatchingEntry.day_rating && dayjs(selectedDay).month() === dayjs(date).month()) {
            tileClassNames.push(`day-rating-${tileMatchingEntry.day_rating}`);
          }

          return tileClassNames;
        }}

        // VALUE CHANGED (day selected)
        onChange={newValue => {
          setSelectedDay(newValue);
        }}

        // ARROW NAVIGATION
        onActiveStartDateChange={({ activeStartDate, view }) => {
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
