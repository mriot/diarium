import React from 'react';
import Navigation from './components/navigation/navigation';
import Sidebar from './components/sidebar/sidebar';
import { BrowserRouter, Route } from "react-router-dom";
import styled from "styled-components";

const Layout = styled.div `
  display: flex;
  flex-flow: column;
  min-height: 100vh;
`;

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { 

     }
  }

  render() { 
    return ( 
      <BrowserRouter>
        <Layout>
          <Navigation />
          <Sidebar />
        </Layout>
      </BrowserRouter>
    )
  }
}

/**
 * dark dark = #20232a
 * lighter dark = #282c34
 * react-blue = #61dafb
 */
