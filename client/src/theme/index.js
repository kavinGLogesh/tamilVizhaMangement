
import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary:    { main: '#8B1A1A', light: '#B22222', dark: '#5C0F0F', contrastText: '#FFF8E7' },
    secondary:  { main: '#C8860A', light: '#E6A020', dark: '#9A6508', contrastText: '#FFF8E7' },
    background: { default: '#FBF5E6', paper: '#FFFDF7' },
    text:       { primary: '#2C1810', secondary: '#7A4F2D' },
    success:    { main: '#2E7D32' },
    error:      { main: '#C62828' },
    info:       { main: '#1565C0' },
  },
  typography: {
    fontFamily: "'Poppins', 'Noto Serif Tamil', sans-serif",
    h1: { fontFamily: "'Noto Serif Tamil', serif", fontWeight: 700 },
    h2: { fontFamily: "'Noto Serif Tamil', serif", fontWeight: 700 },
    h3: { fontFamily: "'Noto Serif Tamil', serif", fontWeight: 600 },
    h4: { fontFamily: "'Noto Serif Tamil', serif", fontWeight: 600 },
    h5: { fontFamily: "'Noto Serif Tamil', serif", fontWeight: 600 },
    h6: { fontFamily: "'Noto Serif Tamil', serif", fontWeight: 600 },
    button: { fontFamily: "'Poppins', sans-serif", fontWeight: 500, letterSpacing: 0.3 },
  },
  shape: { borderRadius: 14 },
  shadows: [
    'none',
    '0 2px 8px rgba(139,26,26,0.06)',
    '0 4px 16px rgba(139,26,26,0.08)',
    '0 6px 24px rgba(139,26,26,0.10)',
    '0 8px 32px rgba(139,26,26,0.12)',
    '0 12px 40px rgba(139,26,26,0.14)',
    ...Array(19).fill('none'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, textTransform: 'none', fontWeight: 600, padding: '9px 22px', transition: 'all 0.25s ease' },
        contained: {
          background: 'linear-gradient(135deg, #8B1A1A 0%, #B22222 100%)',
          boxShadow: '0 4px 15px rgba(139,26,26,0.35)',
          '&:hover': { background: 'linear-gradient(135deg, #5C0F0F 0%, #8B1A1A 100%)', boxShadow: '0 6px 22px rgba(139,26,26,0.45)', transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
        },
        outlined: { borderWidth: '1.5px', '&:hover': { borderWidth: '1.5px', transform: 'translateY(-1px)' } },
      }
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 18, boxShadow: '0 4px 24px rgba(139,26,26,0.07)', border: '1px solid rgba(200,134,10,0.08)', transition: 'box-shadow 0.3s ease' }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'box-shadow 0.2s',
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C8860A' },
            '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(139,26,26,0.1)' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8B1A1A' },
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 20, boxShadow: '0 24px 64px rgba(139,26,26,0.18)' }
      }
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } }
    },
    MuiTableCell: {
      styleOverrides: { root: { borderColor: 'rgba(139,26,26,0.07)' } }
    },
    MuiAppBar: {
      styleOverrides: {
        root: { background: 'linear-gradient(135deg, #4A0A0A 0%, #8B1A1A 55%, #9A6508 100%)', boxShadow: '0 2px 20px rgba(139,26,26,0.4)' }
      }
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } }
    },
    MuiSelect: {
      styleOverrides: {
        root: { borderRadius: 10 }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 6 },
        bar: { borderRadius: 4 }
      }
    }
  }
});

export default theme;
