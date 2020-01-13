import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Calendar as ReactCalendar } from "react-calendar";
import "../../themes/calendar-eros.css";
import moment from "moment";
import { toast } from "react-toastify";
import { Redirect, withRouter } from "react-router-dom";
import { fetchHolidays } from "../../lib/external";
import { getRecordsInRange, getRecordForDay } from "../../lib/backend";

const StyledCalendar = styled(ReactCalendar) `
  border-bottom: 1px solid #191919;
	box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`;

class Calendar extends React.PureComponent {
	constructor(props) {
		super(props);

		this.historyUnlisten = null;
	
		this.state = {
			calendarInitDate: null,
			selectedDay: null,
			fetchedEntries: null,
			fetchedHolidays: null,
			forceUpdateCalendar: 0,
		};
	}
	
	componentDidMount() {
		this.props.shareMethods({
			resetCalendarToToday: () => this.resetCalendarToToday()
		});
		
		const parsedInitDate = moment(window.location.pathname, "YYYY/MM/DD");
		this.setState({
			selectedDay: parsedInitDate.isValid() ? parsedInitDate.toDate() : moment().toDate()
		});

		// listen for URL/history changes
		this.historyUnlisten = this.props.history.listen((location, action) => {
			const parsedDate = moment(location.pathname, "YYYY/MM/DD");
			// console.log("HISTORY CHANGED", parsedDate.format());
			if (parsedDate.isSame(this.state.selectedDay)) return;

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
				.then(dayRecord => this.props.getDayRecord(dayRecord))
				.then(() => this.props.showLoadingbar(false))
				.catch(error => console.error(error));
	
			const rangeRecordsProm = getRecordsInRange(start, end, ["assignedDay", "tags"])
				.then(fetchedEntries => this.setState({ fetchedEntries }))
				.catch(error => {
					console.error(error);
					toast.error("Whoops! 😱 Die Einträge für diesen Monat konnten nicht geladen werden.", { autoClose: 10000 });
					this.setState({ fetchedEntries: {} });
				});
	
			const holidaysProm = fetchHolidays(selectedDay.format("YYYY"))
				.then(result => this.setState({ fetchedHolidays: result }))
				.catch(error => {
					console.error(error);
					toast.error("Whoops! 😱 Die Feiertage konnten nicht geladen werden.", { autoClose: 10000 });
					this.setState({ fetchedHolidays: {} });
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
		this.props.showLoadingbar(true);

		this.setState(prevState => ({
			forceUpdateCalendar: Math.random(),
			selectedDay: today,
		}));

		const { calendarInitDate } = this.state;

		const start = moment(today).startOf("month").subtract(7, "days").format("YYYY-MM-DD");
		const end = moment(today).endOf("month").add(7, "days").format("YYYY-MM-DD");

		getRecordsInRange(start, end, ["assignedDay", "tags"])
			.then(fetchedEntries => this.setState({ fetchedEntries }))
			.then(() => this.props.showLoadingbar(false))
			.catch(error => console.error(error));
	}

	render() {
		const {
			forceUpdateCalendar, calendarInitDate, selectedDay,
			fetchedEntries, fetchedHolidays,
		} = this.state;
		
		if (!selectedDay) return null;
		return (
			<>
				<Redirect push to={`/${moment(selectedDay).format("YYYY/MM/DD")}`} />;

				<StyledCalendar
					className="calendar-dark-theme"
					key={forceUpdateCalendar}
					activeStartDate={calendarInitDate}
					value={selectedDay}
					minDetail="decade"
					minDate={moment("2019-01-01").toDate()}
					tileClassName={({ activeStartDate, date, view }) => {
						if (view !== "month") return false;
						if (!fetchedEntries || !fetchedHolidays) return false;

						const currentTilesDate = moment(date).format("YYYY-MM-DD");
						const { entries } = fetchedEntries;
						const holidays = fetchedHolidays;
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

						const start = moment(activeStartDate).startOf("month").subtract(7, "days").format("YYYY-MM-DD");
						const end = moment(activeStartDate).endOf("month").add(7, "days").format("YYYY-MM-DD");

						// select first day of month
						this.setState({ selectedDay: activeStartDate });

						getRecordsInRange(start, end, ["assignedDay", "tags"])
							.then(fetchedEntries => this.setState({ fetchedEntries }))
							.then(() => this.props.showLoadingbar(false))
							.catch(error => console.error(error));
					}}

					// month selected // fetch data for month with 1 week +- offset
					onClickMonth={activeStartDate => {
						this.props.showLoadingbar(true);
						const start = moment(activeStartDate).startOf("month").subtract(7, "days").format("YYYY-MM-DD");
						const end = moment(activeStartDate).endOf("month").add(7, "days").format("YYYY-MM-DD");

						// select first day of month
						this.setState({ selectedDay: activeStartDate });

						getRecordsInRange(start, end, ["assignedDay", "tags"])
							.then(fetchedEntries => this.setState({ fetchedEntries }))
							.then(() => this.props.showLoadingbar(false))
							.catch(error => console.error(error));
					}}

					// date/day selected (fetch selected day -> all data)
					onClickDay={activeStartDate => {
						this.props.showLoadingbar(true);
						const date = moment(activeStartDate);

						this.setState({ selectedDay: activeStartDate });

						getRecordForDay(date.format("YYYY"), date.format("MM"), date.format("DD"))
							.then(dayRecord => this.props.getDayRecord(dayRecord))
							.then(() => this.props.showLoadingbar(false))
							.catch(error => console.error(error));
					}}
				
					// year selector
					// onClickYear={(...args) => console.log("onClickYear", ...args)}

					// general change listener
					// onChange={value => console.log("onChange:", value)}
				/>
			</>
		);
	}
}

Calendar.propTypes = {
	getDayRecord: PropTypes.func.isRequired,
	showLoadingbar: PropTypes.func.isRequired,
	shareMethods: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
};

export default withRouter(Calendar);
