import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import RouteIcon from '@mui/icons-material/Route';
import FilterListIcon from '@mui/icons-material/FilterList';

const dummyData = [
  {
    id: 1,
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'online',
    phone: '+90 532 123 4567',
    email: 'ahmet.yilmaz@mail.com',
    activeRoute: {
      id: 101,
      name: 'İstanbul-Kadıköy Rotası',
      totalStores: 8,
      completedStores: 3,
    },
    region: 'İstanbul',
    lastActive: '10:30',
  },
  {
    id: 2,
    firstName: 'Mehmet',
    lastName: 'Demir',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'visiting',
    phone: '+90 533 234 5678',
    email: 'mehmet.demir@mail.com',
    activeRoute: {
      id: 102,
      name: 'İstanbul-Beşiktaş Rotası',
      totalStores: 6,
      completedStores: 4,
    },
    region: 'İstanbul',
    lastActive: '10:45',
  },
  // ... daha fazla veri eklenebilir
];

function Merchandisers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return '#4CAF50';
      case 'visiting': return '#2196F3';
      case 'break': return '#FF9800';
      case 'leave': return '#E91E63';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'online': return 'Çevrimiçi';
      case 'visiting': return 'Ziyarette';
      case 'break': return 'Molada';
      case 'leave': return 'İzinde';
      default: return 'Çevrimdışı';
    }
  };

  const filteredData = dummyData.filter(m => {
    const matchesSearch = (m.firstName + ' ' + m.lastName)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesRegion = regionFilter === 'all' || m.region === regionFilter;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
            Merchandiserlar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Toplam {filteredData.length} merchandiser listeleniyor
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Merchandiser Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Durum</InputLabel>
              <Select
                value={statusFilter}
                label="Durum"
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={<FilterListIcon sx={{ ml: 1, mr: 0.5 }} />}
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="online">Çevrimiçi</MenuItem>
                <MenuItem value="visiting">Ziyarette</MenuItem>
                <MenuItem value="break">Molada</MenuItem>
                <MenuItem value="leave">İzinde</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Bölge</InputLabel>
              <Select
                value={regionFilter}
                label="Bölge"
                onChange={(e) => setRegionFilter(e.target.value)}
                startAdornment={<FilterListIcon sx={{ ml: 1, mr: 0.5 }} />}
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="İstanbul">İstanbul</MenuItem>
                <MenuItem value="Ankara">Ankara</MenuItem>
                <MenuItem value="İzmir">İzmir</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {filteredData.map((merchandiser) => (
            <Grid item xs={12} md={6} lg={4} key={merchandiser.id}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  border: '1px solid #eee',
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={merchandiser.avatar}
                    sx={{ width: 50, height: 50, mr: 2 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {merchandiser.firstName} {merchandiser.lastName}
                    </Typography>
                    <Chip
                      size="small"
                      label={getStatusText(merchandiser.status)}
                      sx={{
                        bgcolor: getStatusColor(merchandiser.status),
                        color: '#fff',
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Paper 
                    sx={{ 
                      p: 1.5, 
                      bgcolor: 'rgba(0,0,0,0.02)', 
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.04)',
                      },
                    }}
                    onClick={() => navigate(`/rutlar/${merchandiser.activeRoute.id}`)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <RouteIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {merchandiser.activeRoute.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {merchandiser.activeRoute.completedStores} / {merchandiser.activeRoute.totalStores} Market Tamamlandı
                    </Typography>
                  </Paper>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Tooltip title="Ara">
                    <IconButton 
                      size="small"
                      onClick={() => window.open(`tel:${merchandiser.phone}`)}
                    >
                      <PhoneIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="E-posta Gönder">
                    <IconButton 
                      size="small"
                      onClick={() => window.open(`mailto:${merchandiser.email}`)}
                    >
                      <EmailIcon />
                    </IconButton>
                  </Tooltip>
                  <Box sx={{ flexGrow: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Son aktif: {merchandiser.lastActive}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}

export default Merchandisers; 