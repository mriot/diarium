import React from 'react';
import styled from "styled-components";
import Calendar from 'react-calendar';
import Progress from './progress';
import FetchActions from './fetchactions';

const StyledSidebar = styled.aside`
  width: 300px;
  position: relative;
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

export default class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      calendarInitDate: new Date(),
      forceUpdateCounter: 0,
    }
  }

  render() {
    return (
      <StyledSidebar>
        <Today onClick={() => {
          this.setState({
            forceUpdateCounter: this.state.forceUpdateCounter + 1
          })
        }}>
          {
            this.state.calendarInitDate.toLocaleDateString("de-DE", {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          }
        </Today>
        <Calendar
          key={this.state.forceUpdateCounter}
          value={this.state.calendarInitDate}
          minDetail={"decade"}
          minDate={new Date(2019, 0, 1)}
          tileClassName = {
            ({activeStartDate, date, view}) => {
              if (view === "month") {
                console.log(date.getDate(), date.getMonth() + 1, date.getFullYear());
                // TODO: :)
                if (date.getDate() === 2) {
                  return "marked"
                }
                return null
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
        <FetchActions />
      </StyledSidebar>
    );
  }
}
