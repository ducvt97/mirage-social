'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)',
  },colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1976d2',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#90caf9',
        },
      },
    },
  },
});

export default theme;