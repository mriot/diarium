import React from 'react';
import styled from "styled-components";

const StyledSidebar = styled.aside`
  flex: 1;
  /* width: 300px; */
  position: relative;
  background-color: #555;
`;

const SidebarHandle = styled.div`
  width: 5px;
  position: absolute;
  left: 100%; top: 0; bottom: 0;
  background-color: red;
  cursor: col-resize;
`;

export default class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      sidebarWidth: 300
    }
  }
/*
  startResizeSidebar = evt => {
    let currentPos = evt.clientX;
    console.log(currentPos);
    if (currentPos <= 0) return;
    this.setState({sidebarWidth: currentPos});
  }
*/

  render() {
    return (
      <StyledSidebar style={{width: this.state.sidebarWidth}}>

        {/* <SidebarHandle 
          onDrag={this.startResizeSidebar}
          draggable
        /> */}
      </StyledSidebar>
    );
  }
}
