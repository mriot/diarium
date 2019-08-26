import React from 'react';
import styled from "styled-components";

const StyledLayout = styled.div`
  display: flex;
  flex-flow: column;
  min-height: 100vh;
`;

export default class Layout extends React.PureComponent {
  render() {
    return (
       <StyledLayout>
         {this.props.children}
       </StyledLayout>
    );
  }
}
