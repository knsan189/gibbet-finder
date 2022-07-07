import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import theme from "./lib/theme";
import store from "./redux/store/store";
import { SnackbarProvider } from "notistack";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <HashRouter>
          <CssBaseline />
          <SnackbarProvider
            maxSnack={1}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <App />
          </SnackbarProvider>
        </HashRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
