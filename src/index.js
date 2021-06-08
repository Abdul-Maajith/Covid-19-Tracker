import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from "./App";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const theme1 = createMuiTheme({
  typography: {
    fontFamily: "poppins",
  },
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme1}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


