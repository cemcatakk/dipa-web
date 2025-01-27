import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  palette: {
    primary: {
      main: '#FF6B00',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="firmalar" element={<div>Firmalar Sayfası</div>} />
            <Route path="merchandiserlar" element={<div>Merchandiserlar Sayfası</div>} />
            <Route path="marketler" element={<div>Marketler Sayfası</div>} />
            <Route path="rutlar" element={<div>Rutlar Sayfası</div>} />
            <Route path="ayarlar" element={<div>Ayarlar Sayfası</div>} />
            <Route path="yonetim" element={<div>Yönetim Sayfası</div>} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
