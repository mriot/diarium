import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Calendar as ReactCalendar } from "react-calendar";
import "../../themes/caledar-eros.css";
import moment from "moment";
import { toast } from "react-toastify";
import { fetchHolidays } from "../../lib/external";

const StyledCalendar = styled(ReactCalendar) `
  border-bottom: 1px solid #191919;
	box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`;

export default class Calendar extends React.PureComponent {
	static dayMarker(date, entry, holidays) {
		let classList = [];

		if (holidays[moment(date).format("YYYY-MM-DD")]) {
			classList.push("holiday");
		}

		if (moment(date).isSame(entry.assignedDay)) {
			classList.push("marked");

			if (entry.tags) {
				try {
					classList = classList.concat(JSON.parse(entry.tags));
				} catch (error) {
					console.log(error);
				}
			}
		}
		return classList.join(" ");
	}

	constructor(props) {
		super(props);
	
		this.state = {
			calendarInitDate: moment().toDate(),
			fetchedHolidays: null,
		};
	}
	
	componentDidMount() {
		fetchHolidays()
			.then(result => this.setState({ fetchedHolidays: result }))
			.catch(error => {
				console.error(error);
				toast.error("Whoops! 😱 An error occured while processing the holidays!", { autoClose: 10000 });
				this.setState({ fetchedHolidays: {} });
			});
	}

	render() {
		return (
			<StyledCalendar
				className="calendar-dark-theme"
				key={this.props.forceUpdateCalendar}
				value={this.state.calendarInitDate}
				minDetail="decade"
				minDate={moment("2019-01-01").toDate()}
				tileClassName={({ activeStartDate, date, view }) => {
					if (view === "month") {
						if (!this.props.fetchedEntries || !this.state.fetchedHolidays) return;

						const currentDate = moment(date).format("YYYY-MM-DD");
						const entries = this.props.fetchedEntries;
						const holidays = this.state.fetchedHolidays;

						// eslint-disable-next-line consistent-return
						return entries.map(entry => Calendar.dayMarker(currentDate, entry, holidays));
					}
				}}

				// arrow navigation (view = month => fetch overview)
				onActiveDateChange={changeObj => {
					const { activeStartDate, view } = changeObj;
					console.log("onActiveDateChange", changeObj);
				}}
				// month selector (fetch overview)
				onClickMonth={(...args) => console.log("onClickMonth:", ...args)}
				// date/day changed (fetch selected day -> all data)
				onClickDay={(...args) => console.log("onClickDay", ...args)}
				
				// > year selector (don't need fetch imo)
				// onClickYear={(...args) => console.log("onClickYear", ...args)}

				// > general listener
				// onChange={value => console.log("onChange:", value)}
			/>
		);
	}
}

Calendar.propTypes = {
	forceUpdateCalendar: PropTypes.number.isRequired,
	fetchedEntries: PropTypes.array,

};
