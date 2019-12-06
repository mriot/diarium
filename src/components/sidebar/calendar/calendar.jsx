import React from 'react';
import styled from "styled-components";
import { Calendar as ReactCalendar } from 'react-calendar';
import "./theme/eros.css";

const StyledCalendar = styled(ReactCalendar) `
  border-bottom: 1px solid #191919;
	box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`

export default class Calendar extends React.PureComponent {
	constructor(props) {
		super(props);
	
		this.state = {
			calendarInitDate: new Date(),
		}
	}

	// async getHolidays() {
  //   return fetch(`https://feiertage-api.de/api/?jahr=2019&nur_land=HE`, {
  //     method: "GET",
  //   }).then(response => response.json())
	// }
	
	componentDidMount() {
		// this.holidays = [];
    // this.getHolidays().then(response => {
    //   for (const key in response) {
    //     this.holidays.push({[response[key].datum]: key})
    //   }
    //   console.log(this.holidays)
    // })
	}
	

	render() {
		return (
			<StyledCalendar
				className="calendar-dark-theme"
				key={this.props.forceUpdateCalendar}
				value={this.state.calendarInitDate}
				minDetail={"decade"}
				minDate={new Date(2019, 0, 1)}
				tileClassName = {
					({activeStartDate, date, view}) => {
						if (view === "month") {
							// console.log(date.getDate(), date.getMonth() + 1, date.getFullYear());
							// if (date.getDate() === 2) {
							//   return "marked"
							// }

							// EXAMPLE DATA
							switch (date.getDate()) {
								case 2:
									return "marked holiday"
								case 4:
									return "marked"
								case 10:
									return "vacation"
								case 11:
								return "vacation"
								case 12:
									return "vacation"
								case 14:
									return "sick"
								case 23:
									return "sick"
								case 24:
									return "sick"
								case 25:
									return "sick"
								default:
									return ""
							}
						}
					}
				}

				// arrow navigation (view = month => fetch overview)
				onActiveDateChange={(...args) => console.log("onActiveDateChange", ...args)}
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
