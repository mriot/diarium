import React from 'react';
import Navigation from './components/navigation/navigation';
import Sidebar from './components/sidebar';
import { BrowserRouter, Route } from "react-router-dom";
import NavButton from "./components/navigation/nav-button";
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
      <Layout>
        <Navigation>
          <BrowserRouter>
            <NavButton to="/home" value="Home" />
            <NavButton to="/lorem" value="Lorem" />
            <NavButton to="/ipsum" value="Ipsum" />
            <NavButton to="/navButton" value="NavButton" />

            {/* <Route path="/navButton" render={} /> */}
          </BrowserRouter>
        </Navigation>
        <Sidebar />
      </Layout>
     );
  }
}
/**
 * dark dark = #20232a
 * lighter dark = #282c34
 * react-blue = #61dafb
 */
