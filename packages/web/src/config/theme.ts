import { createMuiTheme } from '@material-ui/core';
import { pink, indigo } from '@material-ui/core/colors';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    card: {
      width: number;
      height: number;
      titleHeight: number;
      contentHeight: number;
      shadow: React.CSSProperties['boxShadow'];
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    card?: {
      width?: number;
      height?: number;
      titleHeight?: number;
      contentHeight?: number;
      shadow?: React.CSSProperties['boxShadow'];
    };
  }
}

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: indigo[600]
    },
    secondary: {
      main: pink[400]
    }
  },
  shape: {
    borderRadius: 0
  },
  card: {
    width: 150,
    height: 104,
    titleHeight: 30,
    contentHeight: 74,
    shadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'
  }
});
