import "../../themes/calendar-eros.scss";
import "react-calendar/dist/Calendar.css";
import { Calendar as ReactCalendar } from "react-calendar";
import { useHistory, useLocation } from "react-router-dom";
import { dayRecordAtom, readModeAtom, showHeatmapAtom } from "../../atoms";
import { fetchHolidays } from "../../lib/external";
import { getRecordForDay, getRecordsInRange } from "../../backend/getters";
import { useRecoilState, useRecoilValue } from "recoil";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import usePrevious from "../../hooks/usePrevious";
import { isDayRecordReady } from "../../lib/utils";
import useLoadingBar from "../../hooks/useLoadingBar";

const StyledCalendar = styled(ReactCalendar)`
  border-bottom: 1px solid #191919;
  box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`;

export default function Calendar() {
  const readMode = useRecoilValue(readModeAtom);
  const showHeatmap = useRecoilValue(showHeatmapAtom);
  const [dayRecord, setDayRecord] = useRecoilState(dayRecordAtom);
  const [fetchedEntries, setFetchedEntries] = useState(null);
  const [fetchedHolidays, setFetchedHolidays] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const prevSelectedDay = usePrevious(selectedDay);
  const location = useLocation();
  const history = useHistory();
  const [addLoader, removeLoader] = useLoadingBar();

  useEffect(() => {
    let date = dayjs(location.pathname, "YYYY/MM/DD");

    if (!date.isValid()) {
      date = dayjs(); // if invalid, use today's date
      history.replace(date.format("YYYY/MM/DD"));
    }

    // force trigger calendar refresh
    if (location.state?.updateCalendar) {
      date = date.add(1, "ms");
    }

    setSelectedDay(date.toDate());
  }, [history, location, setSelectedDay]);

  // DATA FOR SELECTED DAY
  useEffect(() => {
    if (!selectedDay) return;
    if (dayjs(selectedDay).isSame(prevSelectedDay)) return;

    (async () => {
      addLoader();
      const response = await getRecordForDay(...dayjs(selectedDay).format("YYYY-MM-DD").split("-"));
      setDayRecord(response.data);
      removeLoader();
    })();
  }, [addLoader, prevSelectedDay, removeLoader, selectedDay, setDayRecord]);

  // MONTH OVERVIEW
  useEffect(() => {
    if (!selectedDay) return;
    if (dayjs(selectedDay).isSame(prevSelectedDay)) return;

    const start = dayjs(selectedDay).startOf("month").subtract(7, "days").format("YYYY-MM-DD");
    const end = dayjs(selectedDay).endOf("month").add(7, "days").format("YYYY-MM-DD");

    (async () => {
      addLoader();
      const response = await getRecordsInRange(start, end, ["assigned_day", "tags", "day_rating"]);
      setFetchedEntries(response.data.entries);
      removeLoader();
    })();
  }, [addLoader, prevSelectedDay, removeLoader, selectedDay]);

  // HOLIDAYS
  useEffect(() => {
    if (!selectedDay) return;
    if (dayjs(selectedDay).isSame(prevSelectedDay, "year")) return;

    (async () => {
      addLoader();
      const response = await fetchHolidays(dayjs(selectedDay).format("YYYY"));
      setFetchedHolidays(response);
      removeLoader();
    })();
  }, [addLoader, prevSelectedDay, removeLoader, selectedDay]);

  if (!selectedDay) return null;
  return (
    <StyledCalendar
      className={["calendar-dark-theme", showHeatmap ? "day-rating-enabled" : ""]}
      key="diarium_calendar_key"
      value={selectedDay}
      activeStartDate={selectedDay}
      minDetail={!readMode ? "month" : "decade"}
      minDate={!readMode ? dayjs(selectedDay).toDate() : null}
      maxDate={!readMode ? dayjs(selectedDay).toDate() : null}
      tileDisabled={() => !readMode}

      // VALUE CHANGED (day selected)
      onChange={newDate => {
        const date = dayjs(newDate).format("/YYYY/MM/DD");
        history.push(date);
      }}

      // NAVIGATION and "ActiveStartDate" change
      onActiveStartDateChange={({ activeStartDate, value, view }) => {
        // value = new selected date
        if (dayjs(activeStartDate).isSame(value, "month")) return;

        // select "today" instead of first day of month if possible
        const date = dayjs().isSame(activeStartDate, "month") ? new Date() : activeStartDate;
        history.push(dayjs(date).format("/YYYY/MM/DD"));
      }}

      // onClickDay={(...args) => console.log("onClickDay", ...args)}
      // onClickMonth={(...args) => console.log("onClickMonth", ...args)}
      // onClickYear={(...args) => console.log("onClickYear", ...args)}

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
        if (isDayRecordReady(dayRecord) && dayjs(date).isSame(dayRecord.assigned_day)) {
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
    />
  );
}

Calendar.propTypes = {};
