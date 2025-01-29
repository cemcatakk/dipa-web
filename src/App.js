import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import Companies from './pages/Companies';
import Merchandisers from './pages/Merchandisers';
import RouteDetail from './pages/RouteDetail';
import Forms from './pages/Forms';
import Customers from './pages/Customers';
import AllRoutes from './pages/AllRoutes';
import Profile from './pages/Profile';
import Markets from './pages/Markets';
import Management from './pages/Management';
import Representatives from './pages/Representatives';
import RepresentativeEdit from './pages/RepresentativeEdit';
import Messages from './pages/Messages';
import Login from './pages/Login';
import RouteDefinition from './pages/RouteDefinition';


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
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="firmalar" element={<Companies />} />
            <Route path="firmalar/:id" element={<div>Firma Detay</div>} />
            <Route path="firmalar/:id/duzenle" element={<div>Firma Düzenle</div>} />
            <Route path="firmalar/yeni" element={<div>Yeni Firma</div>} />
            <Route path="merchandiserlar" element={<Merchandisers />} />
            <Route path="rutlar" element={<AllRoutes />} />
            <Route path="rutlar/:id" element={<RouteDetail />} />
            <Route path="formlar" element={<Forms />} />
            <Route path="musteriler" element={<Customers />} />
            <Route path="musteriler/:id" element={<div>Müşteri Detay</div>} />
            <Route path="musteriler/yeni" element={<div>Yeni Müşteri</div>} />
            <Route path="musteriler/tanimlar" element={<div>Müşteri Tanımları</div>} />
            <Route path="marketler" element={<Markets />} />
            <Route path="yonetim" element={<Management />} />
            <Route path="profil" element={<Profile />} />
            <Route path="temsilciler" element={<Representatives />} />
            <Route path="temsilciler/duzenle/:id" element={<RepresentativeEdit />} />
            <Route path="mesajlar" element={<Messages />} />
            <Route path="rutlar/tanimla" element={<RouteDefinition />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
