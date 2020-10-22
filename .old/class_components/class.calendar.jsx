/* eslint-disable */

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Calendar as ReactCalendar } from "react-calendar";
import moment from "moment";
import { toast } from "react-toastify";
import { Redirect, withRouter } from "react-router-dom";
import "../../themes/calendar-eros.css";
import { fetchHolidays } from "../src/lib/external";
import { getRecordsInRange, getRecordForDay } from "../src/lib/backend";
import { GlobalContext } from "../src/contexts";

const StyledCalendar = styled(ReactCalendar) `
  border-bottom: 1px solid #191919;
	box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`;

class Calendar extends React.PureComponent {
	constructor(props) {
		super(props);

		this.historyUnlisten = null;
	
		this.state = {
			selectedDay: null,
			fetchedEntries: null,
			fetchedHolidays: null,
			forceUpdateCalendar: 0,
		};
	}
	
	componentDidMount() {
		this.props.shareMethods({
			resetCalendarToToday: () => this.resetCalendarToToday(),
		});
		
		const parsedInitDate = moment(window.location.pathname, "YYYY/MM/DD");
		this.setState({
			selectedDay: parsedInitDate.isValid() ? parsedInitDate.toDate() : moment().toDate(),
		});

		// listen for history changes
		this.historyUnlisten = this.props.history.listen((location, action) => {
			const parsedDate = moment(location.pathname, "YYYY/MM/DD");
			if (parsedDate.isSame(this.state.selectedDay)) return;

			// parse date from URL — fallback is current date
			this.setState({ selectedDay: parsedDate.isValid() ? parsedDate.toDate() : moment().toDate() });
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.selectedDay !== this.state.selectedDay) {
			this.props.showLoadingbar(true);
			const selectedDay = moment(this.state.selectedDay);
			// NOTE: using moment() here again, because startOf/endOf would mutate the original object
			const start = moment(selectedDay).startOf("month").subtract(7, "days").format("YYYY-MM-DD");
			const end = moment(selectedDay).endOf("month").add(7, "days").format("YYYY-MM-DD");
	
			const dayRecordProm = getRecordForDay(
				moment(selectedDay).format("YYYY"),
				moment(selectedDay).format("MM"),
				moment(selectedDay).format("DD")
			)
				.then(fetchedDayRecord => this.context.UPDATE_GLOBAL_DAYRECORD(fetchedDayRecord))
				.then(() => this.props.showLoadingbar(false))
				.catch(error => console.error(error));
	
			const rangeRecordsProm = getRecordsInRange(start, end, ["assignedDay", "tags"])
				.then(fetchedEntries => this.setState({ fetchedEntries }))
				.catch(error => {
					console.error(error);
					toast.error("Whoops! 😱 Die Einträge für diesen Monat konnten nicht geladen werden.");
					this.setState({ fetchedEntries: null });
				});
	
			const holidaysProm = fetchHolidays(selectedDay.format("YYYY"))
				.then(result => this.setState({ fetchedHolidays: result }))
				.catch(error => {
					console.error(error);
					toast.error("Whoops! 😱 Die Feiertage konnten nicht geladen werden.");
					this.setState({ fetchedHolidays: null });
				});
	
			// hide loadingbar if all of above have finished
			Promise.all([dayRecordProm, rangeRecordsProm, holidaysProm])
				.then(() => this.props.showLoadingbar(false));
		}
	}

	componentWillUnmount() {
		this.historyUnlisten();
	}

	resetCalendarToToday(today = moment().toDate()) {
		if (!this.context.GLOBAL_READMODE) return;
		
		this.props.showLoadingbar(true);

		this.setState({
			forceUpdateCalendar: Math.random(),
			selectedDay: today,
		});

		const start = moment(today).startOf("month").subtract(7, "days").format("YYYY-MM-DD");
		const end = moment(today).endOf("month").add(7, "days").format("YYYY-MM-DD");

		getRecordsInRange(start, end, ["assignedDay", "tags"])
			.then(fetchedEntries => this.setState({ fetchedEntries }))
			.then(() => this.props.showLoadingbar(false))
			.catch(error => console.error(error));
	}

	render() {
		const {
			forceUpdateCalendar, selectedDay,
			fetchedEntries, fetchedHolidays,
		} = this.state;

		const { GLOBAL_DAYRECORD, GLOBAL_READMODE } = this.context;
		
		if (!selectedDay) return null;
		return (
			<>
				<Redirect push to={`/${moment(selectedDay).format("YYYY/MM/DD")}`} />

				<StyledCalendar
					className="calendar-dark-theme"
					key="diarium_calendar_key"
					value={selectedDay}
					forceUpdateCalendar={forceUpdateCalendar}
					minDetail={!GLOBAL_READMODE ? "month" : "decade"}
					minDate={!GLOBAL_READMODE ? moment(selectedDay).toDate() : null}
					maxDate={!GLOBAL_READMODE ? moment(selectedDay).toDate() : null}
					tileDisabled={() => !GLOBAL_READMODE}
					tileClassName={({ activeStartDate, date, view }) => {
						if (view !== "month") return false;
						if (!fetchedEntries || !fetchedHolidays) return false;

						const currentTilesDate = moment(date).format("YYYY-MM-DD");

						// global dayRecord (via context) did change — e.g. created
						if (GLOBAL_DAYRECORD && moment(currentTilesDate).isSame(GLOBAL_DAYRECORD.assignedDay)) {
							return [...GLOBAL_DAYRECORD.tags, "marked"].flat(Infinity);
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
						this.props.showLoadingbar(true);
						const { activeStartDate, view } = changeObj;
						if (view !== "month") return;

						const start = moment(activeStartDate).startOf("month").subtract(7, "days").format("YYYY-MM-DD");
						const end = moment(activeStartDate).endOf("month").add(7, "days").format("YYYY-MM-DD");

						// select first day of month
						this.setState({ selectedDay: activeStartDate });

						getRecordsInRange(start, end, ["assignedDay", "tags"])
							.then(fetchedRecords => this.setState({ fetchedEntries: fetchedRecords }))
							.then(() => this.props.showLoadingbar(false))
							.catch(error => console.error(error));
					}}

					// MONTH SELECTED // fetch data for month with 1 week +- offset
					onClickMonth={activeStartDate => {
						this.props.showLoadingbar(true);
						const start = moment(activeStartDate).startOf("month").subtract(7, "days").format("YYYY-MM-DD");
						const end = moment(activeStartDate).endOf("month").add(7, "days").format("YYYY-MM-DD");

						// select first day of month
						this.setState({ selectedDay: activeStartDate });

						getRecordsInRange(start, end, ["assignedDay", "tags"])
							.then(fetchedRecords => this.setState({ fetchedEntries: fetchedRecords }))
							.then(() => this.props.showLoadingbar(false))
							.catch(error => console.error(error));
					}}

					// DATE/DAY SELECTED (fetch selected day -> all data)
					onClickDay={activeStartDate => {
						this.props.showLoadingbar(true);
						const date = moment(activeStartDate);

						this.setState({ selectedDay: activeStartDate });

						getRecordForDay(date.format("YYYY"), date.format("MM"), date.format("DD"))
							.then(fetchedDayRecord => this.context.UPDATE_GLOBAL_DAYRECORD(fetchedDayRecord))
							.then(() => this.props.showLoadingbar(false))
							.catch(error => console.error(error));
					}}
				
					// YEAR SELECTOR
					// onClickYear={(...args) => console.log("onClickYear", ...args)}

					// GENERAL CHANGE LISTENER
					// onChange={value => console.log("onChange:", value)}
				/>
			</>
		);
	}
}

Calendar.propTypes = {
	showLoadingbar: PropTypes.func.isRequired,
	shareMethods: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired, // react-router
};

Calendar.defaultProps = {};

Calendar.contextType = GlobalContext;

export default withRouter(Calendar);
