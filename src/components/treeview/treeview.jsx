import React from 'react';
import styled from 'styled-components';
import Month from  "./month";
import Calendar from 'react-calendar'

const TreeRoot = styled.div `

`
const Year = styled.div `

`

export default class TreeView extends React.PureComponent {
  render() {
    return (
       <TreeRoot>
         <Calendar
          showNavigation={false}
         />
       </TreeRoot>
    );
  }
}
