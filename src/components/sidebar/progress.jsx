import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ProgressBar from "../common/progressbar";
import { countAllEntries, countRecordsInRange } from "../../backend/counters";
import { useRecoilValue } from "recoil";
import { selectedDayAtom } from "../../atoms";
import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";

const ProgressContainer = styled.div`
  padding: 0 0 5px 5px;
  border-bottom: 1px solid #191919;
  box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`;
const ProgressDescription = styled.div`
  color: #efefef;
  font-size: 15px;
  font-weight: 100;
  margin: 15px 0 5px;

  span {
    margin-left: 5px;
    opacity: 0.5;
  }
`;
const TotalDescription = styled(ProgressDescription)`
  margin: 20px 0 0;
`;

export default function Progress() {
  const selectedDay = useRecoilValue(selectedDayAtom);
  const [progressMonth, setProgressMonth] = useState({ count: 0, percent: 0 });
  const [progressYear, setProgressYear] = useState({ count: 0, percent: 0 });
  const [progressTotal, setProgressTotal] = useState(0);

  dayjs.extend(isLeapYear);

  useEffect(() => {
    (async () => {
      try {
        const response = await countAllEntries();
        setProgressTotal(response.data.all_records);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!dayjs(selectedDay).isValid()) return;

    (async () => {
      try {
        const yearResponse = await countRecordsInRange(
          dayjs(selectedDay).startOf("year").format("YYYY-MM-DD"),
          dayjs(selectedDay).add(1, "year").startOf("year").format("YYYY-MM-DD")
        );
        const monthResponse = await countRecordsInRange(
          dayjs(selectedDay).startOf("month").format("YYYY-MM-DD"),
          dayjs(selectedDay).add(1, "month").startOf("month").format("YYYY-MM-DD")
        );

        const yearRecs = yearResponse.data.records_in_range;
        const monthRecs = monthResponse.data.records_in_range;

        setProgressYear({
          count: yearRecs,
          percent: ((yearRecs / (dayjs(selectedDay).isLeapYear() ? 366 : 365)) * 100).toFixed(2)
        });
        setProgressMonth({
          count: monthRecs,
          percent: ((monthRecs / dayjs(selectedDay).daysInMonth()) * 100).toFixed(2)
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [selectedDay]);

  return (
    <ProgressContainer>
      <ProgressDescription>
          Einträge in {dayjs(selectedDay).year()}: {progressYear.count}
        <span>({progressYear.percent}%)</span>
      </ProgressDescription>
      <ProgressBar progress={progressYear.percent} />

      <ProgressDescription>
          Einträge im {dayjs(selectedDay).format("MMMM")}: {progressMonth.count}
        <span>({progressMonth.percent}%)</span>
      </ProgressDescription>
      <ProgressBar progress={progressMonth.percent} />

      <TotalDescription>
          Einträge gesamt: {progressTotal}
      </TotalDescription>
    </ProgressContainer>
  );
}

Progress.propTypes = {

};
