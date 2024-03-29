import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ProgressBar from "../common/progressbar";
import { count } from "../../backend/counters";
import { useRecoilValue } from "recoil";
import { dayRecordAtom } from "../../atoms";
import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
import { toast } from "react-toastify";
import usePrevious from "../../hooks/usePrevious";
import useSelectedDay from "../../hooks/useSelectedDay";
import useChangeDetector from "../../hooks/useChangeDetector";

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
  const dayRecord = useRecoilValue(dayRecordAtom);
  const [progressMonth, setProgressMonth] = useState({ count: 0, percent: 0 });
  const [progressYear, setProgressYear] = useState({ count: 0, percent: 0 });
  const [progressTotal, setProgressTotal] = useState(0);
  const selectedDay = useSelectedDay();
  const prevSelectedDay = usePrevious(selectedDay);
  const prevDayRecord = usePrevious(dayRecord);
  // const change = useChangeDetector({ selectedDay: true, both: true, dayRecord: { created: true } });

  // useEffect(() => {
  //   if (change) console.log(change);
  // }, [change]);

  dayjs.extend(isLeapYear);

  useEffect(() => {
    // if (!dayRecord || dayRecord === prevDayRecord) return;
    if (!selectedDay || dayjs(selectedDay).isSame(prevSelectedDay)) return;
    console.log("udpate");

    const date = dayjs(selectedDay);

    (async () => {
      const response = await count(date.format("YYYY/MM"));
      const { data } = response;

      if (response.status !== 200) {
        toast.error("Could not check progress!");
        return;
      }

      setProgressTotal(data.total);
      setProgressYear({
        count: data.year,
        percent: ((data.year / (date.isLeapYear() ? 366 : 365)) * 100).toFixed(2)
      });
      setProgressMonth({
        count: data.month,
        percent: ((data.month / date.daysInMonth()) * 100).toFixed(2)
      });
    })();
  }, [prevSelectedDay, selectedDay]);

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
