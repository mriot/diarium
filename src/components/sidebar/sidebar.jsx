import React from 'react';
import styled from "styled-components";
import Calendar from 'react-calendar';

const StyledSidebar = styled.aside`
  flex: 1;
  position: relative;
  background-color: #555;
`;

export default class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      sidebarWidth: 300
    }
  }

  render() {
    return (
      <StyledSidebar style={{width: this.state.sidebarWidth}}>
        <Calendar
          showNavigation={true}
         />
      </StyledSidebar>
    );
  }
}
