import React from 'react';
import styled from "styled-components";
import { BrowserRouter } from "react-router-dom";
import Navigation from './components/navigation/navigation';
import Sidebar from './components/sidebar/sidebar';
import Editor from './components/editor/editor';
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
  render() { 
    return ( 
      <BrowserRouter>
        <Layout>
          <Navigation />
          <Main>
            <Sidebar />
            <Editor />
          </Main>
        </Layout>
      </BrowserRouter>
    )
  }
}
