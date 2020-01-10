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
		this.props.showLoadingbar(true);
		const start = moment(this.state.calendarInitDate).subtract(7, "days").format("YYYY-MM-DD");
		const end = moment(this.state.calendarInitDate).add(1, "month").add(7, "days").format("YYYY-MM-DD");

		const prom1 = getRecordsInRange(start, end, ["assignedDay", "tags"])
			.then(fetchedEntries => this.setState({ fetchedEntries }))
			.catch(error => {
				console.error(error);
				toast.error("Whoops! 😱 An error occured while processing the entries!", { autoClose: 10000 });
				this.setState({ fetchedEntries: {} });
			});

		const prom2 = fetchHolidays(moment(this.state.calendarInitDate).format("YYYY"))
			.then(result => this.setState({ fetchedHolidays: result }))
			.catch(error => {
				console.error(error);
				toast.error("Whoops! 😱 An error occured while processing the holidays!", { autoClose: 10000 });
				this.setState({ fetchedHolidays: {} });
			});

		const today = moment(this.state.calendarInitDate);
		const prom3 =	getRecordForDay(today.format("YYYY"), today.format(("MM")), today.format("DD"))
			.then(dayRecord => this.props.getDayRecord(dayRecord))
			.catch(error => console.error(error));
			
			
		Promise.all([prom1, prom2, prom3])
			.then(() => this.props.showLoadingbar(false));
	}

	resetCalendarToInitDate() {
		this.props.showLoadingbar(true);
		this.setState({ forceUpdateCalendar: Math.random() });

		const start = moment(this.state.calendarInitDate).subtract(7, "days").format("YYYY-MM-DD");
		const end = moment(this.state.calendarInitDate).add(1, "month").add(7, "days").format("YYYY-MM-DD");

		getRecordsInRange(start, end, ["assignedDay", "tags"])
			.then(fetchedEntries => this.setState({ fetchedEntries }))
			.then(() => this.props.showLoadingbar(false))
			.catch(error => console.error(error));
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
					const { entries } = this.state.fetchedEntries;
					const holidays = this.state.fetchedHolidays;
					const classNamesArray = [];

					if (holidays[moment(date).format("YYYY-MM-DD")]) classNamesArray.push("holiday");

					classNamesArray.push(
						entries.map(entry => {
							const classList = [];
							if (moment(currentTilesDate).isSame(entry.assignedDay)) {
								classList.push("marked");
								classList.push(entry.tags);
							}
							return classList.flat();
						})
					);

					return classNamesArray.flat(Infinity);
				}}

				// arrow navigation
				onActiveDateChange={changeObj => {
					this.props.showLoadingbar(true);
					const { activeStartDate, view } = changeObj;
					if (view !== "month") return;

					const start = moment(activeStartDate).subtract(7, "days").format("YYYY-MM-DD");
					const end = moment(activeStartDate).add(1, "month").add(7, "days").format("YYYY-MM-DD");

					getRecordsInRange(start, end, ["assignedDay", "tags"])
						.then(fetchedEntries => this.setState({ fetchedEntries }))
						.then(() => this.props.showLoadingbar(false))
						.catch(error => console.error(error));
				}}

				// month selected // fetch data for month with 1 week +- offset
				onClickMonth={activeStartDate => {
					this.props.showLoadingbar(true);
					const start = moment(activeStartDate).subtract(7, "days").format("YYYY-MM-DD");
					const end = moment(activeStartDate).add(1, "month").add(7, "days").format("YYYY-MM-DD");

					getRecordsInRange(start, end, ["assignedDay", "tags"])
						.then(fetchedEntries => this.setState({ fetchedEntries }))
						.then(() => this.props.showLoadingbar(false))
						.catch(error => console.error(error));
				}}

				// date/day selected (fetch selected day -> all data)
				onClickDay={activeStartDate => {
					this.props.showLoadingbar(true);
					const date = moment(activeStartDate);

					getRecordForDay(date.format("YYYY"), date.format(("MM")), date.format("DD"))
						.then(dayRecord => this.props.getDayRecord(dayRecord))
						.then(() => this.props.showLoadingbar(false))
						.catch(error => console.error(error));
				}}
				
				// year selector
				// onClickYear={(...args) => console.log("onClickYear", ...args)}

				// general change listener
				// onChange={value => console.log("onChange:", value)}
			/>
		);
	}
}

Calendar.propTypes = {
	getDayRecord: PropTypes.func.isRequired,
	showLoadingbar: PropTypes.func.isRequired,
};
