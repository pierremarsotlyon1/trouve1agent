import React  from 'react';
import Header from '../../components/header/Header';
import Notification from '../../components/notification/Notification';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Footer from '../../components/footer/Footer';

injectTapEventPlugin();

import './App.css';

const App = (props) => (
  <MuiThemeProvider>
    <div id="app-agent" className="bg--secondary">
      <Notification/>
      <Header/>
      <div className="main-container">
        {props.children}
      </div>
      <Footer/>
    </div>
  </MuiThemeProvider>
);

export default App;
