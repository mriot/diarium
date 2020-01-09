import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Calendar as ReactCalendar } from "react-calendar";
import "../../themes/caledar-eros.css";
import moment from "moment";
import { toast } from "react-toastify";
import { fetchHolidays } from "../../lib/external";
import { getRecordsInRange, getRecordForDay } from "../../lib/backend";

const StyledCalendar = styled(ReactCalendar) `
  border-bottom: 1px solid #191919;
	box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`;

export default class Calendar extends React.PureComponent {
	static dayMarker(date, entry) {
		const classList = [];

		if (moment(date).isSame(entry.assignedDay)) {
			classList.push("marked");

			if (entry.tags) {
				try {
					classList.push(JSON.parse(entry.tags));
				} catch (error) {
					console.log(error);
				}
			}
		}
		return classList.flat(Infinity);
	}

	constructor(props) {
		super(props);
	
		this.state = {
			calendarInitDate: moment().toDate(),
			forceUpdateCalendar: 0,
			fetchedEntries: null,
			fetchedHolidays: null,
		};
	}
	
	componentDidMount() {
		const start = moment(this.state.calendarInitDate).subtract(7, "days").format("YYYY-MM-DD");
		const end = moment(this.state.calendarInitDate).add(1, "month").add(7, "days").format("YYYY-MM-DD");

		getRecordsInRange(start, end, ["assignedDay", "tags"])
			.then(fetchedEntries => this.setState({ fetchedEntries }))
			.catch(error => {
				console.error(error);
				toast.error("Whoops! 😱 An error occured while processing the entries!", { autoClose: 10000 });
				this.setState({ fetchedEntries: {} });
			});

		fetchHolidays(moment(this.state.calendarInitDate).format("YYYY"))
			.then(result => this.setState({ fetchedHolidays: result }))
			.catch(error => {
				console.error(error);
				toast.error("Whoops! 😱 An error occured while processing the holidays!", { autoClose: 10000 });
				this.setState({ fetchedHolidays: {} });
			});
	}

	resetCalendarToInitDate() {
		this.setState({ forceUpdateCalendar: Math.random() });

		const start = moment(this.state.calendarInitDate).subtract(7, "days").format("YYYY-MM-DD");
		const end = moment(this.state.calendarInitDate).add(1, "month").add(7, "days").format("YYYY-MM-DD");

		getRecordsInRange(start, end, ["assignedDay", "tags"])
			.then(fetchedEntries => this.setState({ fetchedEntries }));
	}

	render() {
		return (
			<StyledCalendar
				className="calendar-dark-theme"
				key={this.state.forceUpdateCalendar}
				value={this.state.calendarInitDate}
				minDetail="decade"
				minDate={moment("2019-01-01").toDate()}
				tileClassName={({ activeStartDate, date, view }) => {
					if (view !== "month") return false;
					if (!this.state.fetchedEntries || !this.state.fetchedHolidays) return false;

					const currentTilesDate = moment(date).format("YYYY-MM-DD");
					const entries = this.state.fetchedEntries;
					const holidays = this.state.fetchedHolidays;
					const classNamesArray = [];

					classNamesArray.push(
						holidays[moment(date).format("YYYY-MM-DD")] ? "holiday" : []
					);

					classNamesArray.push(
						entries.flatMap(entry => Calendar.dayMarker(currentTilesDate, entry, holidays))
					);

					return classNamesArray.flat(Infinity);
				}}

				// arrow navigation
				onActiveDateChange={changeObj => {
					const { activeStartDate, view } = changeObj;
					if (view !== "month") return;

					const start = moment(activeStartDate).subtract(7, "days").format("YYYY-MM-DD");
					const end = moment(activeStartDate).add(1, "month").add(7, "days").format("YYYY-MM-DD");

					getRecordsInRange(start, end, ["assignedDay", "tags"])
						.then(fetchedEntries => this.setState({ fetchedEntries }));
				}}

				// month selected // fetch data for month with 1 week +- offset
				onClickMonth={activeStartDate => {
					const start = moment(activeStartDate).subtract(7, "days").format("YYYY-MM-DD");
					const end = moment(activeStartDate).add(1, "month").add(7, "days").format("YYYY-MM-DD");

					getRecordsInRange(start, end, ["assignedDay", "tags"])
						.then(fetchedEntries => this.setState({ fetchedEntries }));
				}}

				// date/day selected (fetch selected day -> all data)
				onClickDay={activeStartDate => {
					const date = moment(activeStartDate);

					getRecordForDay(date.format("YYYY"), date.format(("MM")), date.format("DD"))
						// .then(result => (result && JSON.parse(result.tags)) || [])
						// .then(tags => this.props.dealTags(tags))
						.then(dayRecord => this.props.getDayRecord(dayRecord))
						.catch(error => console.error(error));
				}}
				
				// year selector (maybe pre-fetch (?))
				// onClickYear={(...args) => console.log("onClickYear", ...args)}

				// general change listener
				// onChange={value => console.log("onChange:", value)}
			/>
		);
	}
}

Calendar.propTypes = {
	getDayRecord: PropTypes.func.isRequired,
};
