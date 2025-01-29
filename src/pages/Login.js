import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // Giriş işlemi burada yapılacak
    navigate('/');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#f5f5f5',
      p: 2,
    }}>
      <Paper elevation={3} sx={{
        width: '100%',
        maxWidth: 400,
        p: 4,
        textAlign: 'center',
      }}>
        <Box sx={{ mb: 4 }}>
          <img 
            src="/assets/images/logo.png" 
            alt="Logo" 
            style={{ 
              height: 60,
              marginBottom: 24
            }} 
          />
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Hoş Geldiniz
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Devam etmek için giriş yapın
          </Typography>
        </Box>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="E-posta"
            variant="outlined"
            margin="normal"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Şifre"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            my: 2 
          }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={credentials.rememberMe}
                  onChange={(e) => setCredentials({ 
                    ...credentials, 
                    rememberMe: e.target.checked 
                  })}
                  color="primary"
                />
              }
              label="Beni hatırla"
            />
            {/* <Button 
              variant="text" 
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Şifremi unuttum
            </Button> */}
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ 
              mt: 2,
              mb: 2,
              height: 48,
              color: '#fff'
            }}
          >
            Giriş Yap
          </Button>
        </form>

        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} DIPA. Tüm hakları saklıdır.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login; 