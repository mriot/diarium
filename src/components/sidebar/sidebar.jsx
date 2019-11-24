import React from 'react';
import styled from "styled-components";
import Calendar from 'react-calendar';
import Progress from './progress';
import FetchActions from './fetchactions';

const StyledSidebar = styled.aside`
  flex: 1;
  position: relative;
  background-color: #20232a;
`

export default class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      sidebarWidth: 300,
      calendarInitDate: new Date()
    }
  }

  render() {
    return (
      <StyledSidebar style={{width: this.state.sidebarWidth}}>
        <Calendar
          value={this.state.calendarInitDate}
          minDetail={"decade"}
          minDate={new Date(2019, 0, 1)}

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
