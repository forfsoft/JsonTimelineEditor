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
// timeline slider bar description위에다가 ui 배치하기
// python으로 각 리비전마다 diff result파일 만들어서 뷰어는 뷰만 하도록 만들기
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
