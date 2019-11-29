import React from 'react';
import Navigation from './components/navigation/navigation';
import Sidebar from './components/sidebar/sidebar';
import { BrowserRouter, Route } from "react-router-dom";
import styled from "styled-components";
import MarkdownEditor from './components/editor/markdown-editor';
import 'react-tippy/dist/tippy.css';

const Layout = styled.div `
  display: flex;
  flex-flow: column;
  height: 100vh;
`
const Main = styled.div `
  display: flex;
  align-items: stretch;
  height: 100%;
`

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
          <Main>
            <Sidebar />
            <MarkdownEditor />
          </Main>
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
