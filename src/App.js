import React from 'react';
import Navigation from './components/navigation';
import Sidebar from './components/sidebar';
import Layout from "./components/layout";
import { BrowserRouter, Route } from "react-router-dom";
import NavButton from "./components/nav-button";

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
