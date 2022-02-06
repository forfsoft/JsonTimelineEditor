import './App.css';
import React, { Component } from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import TimelineDataGrid from './components/TimelineDataGrid'
import { Box } from '@material-ui/core'

const theme = createTheme({
  palette: {
    type: 'dark',
  },
});
// javascript로 key 기준 row diff 로직 구현해서 result json 만들기
export default function App() {
  console.log("modify")

  return (
    <ThemeProvider theme={theme}>

        <Box
          sx={{
            display: 'flex',
            width: '100%',
            bgcolor: 'background.default',
            color: 'text.primary',
            borderRadius: 1,
          }}
        >
          <TimelineDataGrid />
        </Box>
    </ThemeProvider>
  );
}
