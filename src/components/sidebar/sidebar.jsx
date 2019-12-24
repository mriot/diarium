import React from 'react';
import styled from "styled-components";
import Progress from './progress';
import Calendar from './calendar';
import MetaEditor from './meta-editor';

const StyledSidebar = styled.aside`
  position: relative;
  width: 300px;
  display: flex;
  flex-direction: column;
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

export default class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dateToday: new Date(),
      forceUpdateCalendar: 0,
    }
  }

  componentDidMount() {
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

        <Calendar forceUpdateCalendar={this.state.forceUpdateCalendar} />

        <MetaEditor isReadModeActive={this.props.isReadModeActive} />

        <Progress />
      </StyledSidebar>
    );
  }
}
