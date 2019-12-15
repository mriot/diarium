import React from 'react';
import styled from "styled-components";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from './components/navigation/navigation';
import Sidebar from './components/sidebar/sidebar';
import Editor from './components/editor/editor';
import Favorites from './components/favorites';
import posed, { PoseGroup } from "react-pose";
import uuid4 from "uuid/v4";

const Layout = styled.div `
  position: relative;
  display: flex;
  flex-flow: column;
  height: 100vh;
`
const Main = styled.div `
  position: relative;
  display: flex;
  align-items: stretch;
  height: 100%;
`

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      readMode: false,
      showFavorites: false,
    }
  }
  
  render() {
    return ( 
      <BrowserRouter>
        <Layout>
          <Navigation
            isReadModeActive={this.state.readMode}
            setReadMode={bool => this.setState({readMode: bool})}
            isFavoriteViewActive={this.state.showFavorites}
            setFavoriteView={bool => this.setState({showFavorites: bool})}
          />
          <Main>
            <Sidebar
              isReadModeActive={this.state.readMode}
            />

            <PoseGroup>
              {this.state.showFavorites && 
                <Favorites key={uuid4()}  />
              }
            </PoseGroup>

            <Editor
              isReadModeActive={this.state.readMode}
              pose={this.state.showFavorites ? "hidden" : "visible"}
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
