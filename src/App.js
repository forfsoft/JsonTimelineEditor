import './App.css';
import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import TimelineDataGrid from './components/TimelineDataGrid'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <TimelineDataGrid />
        </div>
      </MuiThemeProvider>
    );
  }
}


export default App;
