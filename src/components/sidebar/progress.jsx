import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";
import { withRouter } from "react-router-dom";
import ProgressBar from "../common/progressbar";
import { countAllEntries, countRecordsInRange } from "../../backend/counters";
import { useRecoilValue } from "recoil";
import { selectedDayAtom } from "../../atoms";

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

export default function Progress(props) {
  const selectedDay = useRecoilValue(selectedDayAtom);
  const [progressWeek, setProgressWeek] = useState(0);
  const [progressMonth, setProgressMonth] = useState(0);
  const [progressYear, setProgressYear] = useState(0);
  const [progressTotal, setProgressTotal] = useState(0);

  useEffect(() => {
    // todo listen for history changes
    /*
    this.historyUnlisten = this.props.history.listen((location, action) => {
      const parsedDate = moment(location.pathname, "YYYY/MM/DD");
      if (!parsedDate.isValid() || parsedDate.isSame(this.state.selectedDay)) return;

      this.updateProgress(parsedDate);
    });
    */

    // todo unlisten on unmount
  }, []);

  useEffect(() => {
    const parsedDate = moment(window.location.pathname, "YYYY/MM/DD");

    if (parsedDate.isValid() && parsedDate.isSame(selectedDay)) {
      updateProgress();
    }
  }, [selectedDay]);

  const updateProgress = (pathname) => {
    const parsedSelectedDay = moment(pathname, "YYYY/MM/DD").format("YYYY-MM-DD");

    _countAllEntries();

    _countRecordsInRange(
      moment(selectedDay).startOf("month").format("YYYY-MM-DD"),
      moment(selectedDay).add(1, "month").startOf("month").format("YYYY-MM-DD"),
      "progressMonth"
    );

    _countRecordsInRange(
      moment(selectedDay).startOf("year").format("YYYY-MM-DD"),
      moment(selectedDay).add(1, "year").startOf("year").format("YYYY-MM-DD"),
      "progressYear"
    );
  };

  const _countAllEntries = () => {
    countAllEntries()
      .then(response => {
        this.setState({ progressTotal: response.all_records });
      })
      .catch(error => console.log(error));
  };

  const _countRecordsInRange = (start, end, stateKey) => {
    countRecordsInRange(start, end)
      .then(response => {
        this.setState({ [stateKey]: response.records_in_range });
      })
      .catch(error => console.log(error));
  };

  // todo ahhhhh fix meee
  const progressYearPercent = ((progressYear / (moment(selectedDay).isLeapYear() ? 366 : 365)) * 100).toFixed(2);
  const progressMonthPercent = ((progressMonth / moment(selectedDay).daysInMonth()) * 100).toFixed(2);

  return (
    <ProgressContainer>
      {/* <ProgressDescription>
          Einträge in KW {moment(selectedDay).week()}: {(this.state.progressWeek / 7 * 100).toFixed(2)}%
        </ProgressDescription>
        <ProgressBar progress={this.state.progressWeek} /> */}

      <ProgressDescription>
          Einträge im {moment(selectedDay).format("MMMM")}: {progressMonth}
        <span>({progressMonthPercent}%)</span>
      </ProgressDescription>
      <ProgressBar progress={progressMonthPercent} />

      <ProgressDescription>
          Einträge in {moment(selectedDay).year()}: {progressYear}
        <span>({progressYearPercent}%)</span>
      </ProgressDescription>
      <ProgressBar progress={progressYearPercent} />

      <TotalDescription>
          Einträge gesamt: {progressTotal}
      </TotalDescription>
    </ProgressContainer>
  );
}

Progress.propTypes = {
  history: PropTypes.object.isRequired
};
