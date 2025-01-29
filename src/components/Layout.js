import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import RouteIcon from '@mui/icons-material/Route';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ChatIcon from '@mui/icons-material/Chat';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: 0,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#fff',
  color: '#333',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Rutlar', icon: <RouteIcon />, path: '/rutlar' },
  { text: 'Merchandiserlar', icon: <PeopleIcon />, path: '/merchandiserlar' },
  {
    icon: <ChatIcon />,
    text: 'Mesajlar',
    path: '/mesajlar'
  },
  { text: 'Marketler', icon: <StoreIcon />, path: '/marketler' },
  { text: 'Temsilciler', icon: <PeopleIcon />, path: '/temsilciler' },
  { text: 'Organizasyonlar', icon: <BusinessIcon />, path: '/firmalar' },
  {
    icon: <StorefrontIcon />,
    text: 'Müşteriler',
    path: '/musteriler'
  },
  {
    icon: <DescriptionIcon />,
    text: 'Formlar',
    path: '/formlar'
  },
  { text: 'Yönetim', icon: <AdminPanelSettingsIcon />, path: '/yonetim' },
];

function Layout() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <img src="/assets/images/logo.png" alt="Logo" height="40" style={{ marginRight: 16 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            DIPA Yönetim Paneli
          </Typography>
          <IconButton 
            color="inherit"
            onClick={() => navigate('/profil')}
            sx={{ 
              '&:hover': { 
                bgcolor: 'rgba(0, 0, 0, 0.04)' 
              } 
            }}
          >
            <Avatar sx={{ bgcolor: 'secondary.main' }}>NS</Avatar>
          </IconButton>
          <IconButton 
            color="inherit"
            onClick={handleLogout}
            sx={{ 
              '&:hover': { 
                bgcolor: 'rgba(0, 0, 0, 0.04)' 
              } 
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Drawer variant="permanent" open={open}>
        <DrawerHeader />
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                cursor: 'pointer',
                backgroundColor: location.pathname === item.path ? 'rgba(255, 107, 0, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: location.pathname === item.path 
                    ? 'rgba(255, 107, 0, 0.12)' 
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: location.pathname === item.path ? 'primary.main' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  opacity: open ? 1 : 0,
                  color: location.pathname === item.path ? 'primary.main' : 'inherit',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
}

export default Layout; 