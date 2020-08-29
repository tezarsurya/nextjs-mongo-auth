import { createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#0fbcf9",
      light: "#4bcffa",
    },
    secondary: {
      main: "#808e9b",
      light: "#d2dae2",
    },
    error: {
      main: "#f53b57",
      light: "#ef5777",
    },
    info: {
      main: "#00d8d6",
      light: "#34e7e4",
    },
    success: {
      main: "#05c46b",
      light: "#0be881",
    },
    warning: {
      main: "#ffa801",
      light: "#ffc048",
    },
    background: {
      default: "#1e272e",
      paper: "#485460",
    },
  },
});

export default theme;
