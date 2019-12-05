import React from 'react';
import styled from "styled-components";
import Calendar from 'react-calendar';
import Progress from './progress';
import FetchActions from './fetchactions';

const StyledSidebar = styled.aside`
  position: relative;
  width: 300px;
  max-height: 100%;
  box-sizing: border-box;
  background-color: #20232a;
`
const Today = styled.div `
  color: #fff;
  font-size: 18px;
  padding: 10px;
  cursor: pointer;
  text-align: center;

  &:hover {
    text-decoration: underline;
  }
`
const StyledCalendar = styled(Calendar) `
  border-bottom: 1px solid #191919;
	box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.2);
`

export default class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      calendarInitDate: new Date(),
      dateToday: new Date(),
      forceUpdateCalendar: 0,
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

    setInterval(this.updateTodaysDate.bind(this), 1000 * 60 * 5) // 5 minutes
  }

  updateTodaysDate() {
    this.setState({dateToday: new Date()})
  }
  
  render() {
    return (
      <StyledSidebar>
        <Today onClick={() => {
          this.setState({
            dateToday: new Date(),
            calendarInitDate: new Date(),
            forceUpdateCalendar: this.state.forceUpdateCalendar + 1
          })
        }}>
          {
            this.state.dateToday.toLocaleDateString("de-DE", {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          }
        </Today>
        <StyledCalendar
          className="calendar-dark-theme"
          key={this.state.forceUpdateCalendar}
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

          // arrow navigation (view = month => fetch)
          onActiveDateChange={(...args) => console.log("onActiveDateChange", ...args)}
          // month selector (fetch)
          onClickMonth={(...args) => console.log("onClickMonth:", ...args)}

          // date/day changed  (fetch? -> maybe refetch day)
          onClickDay={(...args) => console.log("onClickDay", ...args)}
          
          // > year selector (don't need fetch imo)
          // onClickYear={(...args) => console.log("onClickYear", ...args)}
          // > general listener
          // onChange={value => console.log("onChange:", value)}
        />
        <Progress />
        {/* <FetchActions /> */}
      </StyledSidebar>
    );
  }
}
