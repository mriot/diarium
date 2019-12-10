import React from 'react';
import styled from "styled-components";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from './components/navigation/navigation';
import Sidebar from './components/sidebar/sidebar';
import Editor from './components/editor/editor';

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
      readMode: false,
    }
  }

  render() { 
    return ( 
      <BrowserRouter>
        <Layout>
          <Navigation
            isReadModeActive={this.state.readMode}
            setReadMode={bool => this.setState({readMode: bool})}
          />
          <Main>
            <Sidebar />
            <Editor 
              isReadModeActive={this.state.readMode}
            />
          </Main>
          <ToastContainer
            position="bottom-left"
            // hideProgressBar={true}
            // autoClose={5000}
            newestOnTop={true}
            progressStyle={{
              "background": "linear-gradient(to right, #00b7ff, #5ac8fa, #007aff, #34aadc)"
            }}
            style={{
              "max-width": "300px",
              "left": 0
            }}
          />
        </Layout>
      </BrowserRouter>
    )
  }
}
