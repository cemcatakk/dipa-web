import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Paper, TextField, Select, MenuItem, FormControl, InputLabel, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Grid, Chip } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet için default ikonları düzeltme
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom Merchandiser marker
const merchandiserIcon = new L.divIcon({
  className: 'custom-div-icon',
  html: '<div style="background-color: #FF6B00; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white;"></div>',
  iconSize: [30, 30],
});

const DashboardContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  padding: '12px 12px 24px 12px',
  height: 'calc(100vh - 88px)',
});

const MapSection = styled(Paper)(({ theme }) => ({
  height: '60%',
  overflow: 'hidden',
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const ChartsSection = styled(Box)(({ theme }) => ({
  height: '40%',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: 24,
}));

const SidePanel = styled(Paper)(({ theme }) => ({
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const StatsContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: 8,
});

const StatBox = styled(Paper)(({ color }) => ({
  padding: 12,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 8,
  backgroundColor: color,
  color: '#fff',
  transition: 'transform 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const ChartCard = styled(Paper)(({ theme }) => ({
  padding: 16,
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const dummyData = {
  merchandisers: [
    { 
      id: 1, 
      name: 'Ahmet Yılmaz', 
      status: 'online', 
      avatar: 'https://i.pravatar.cc/150?img=1',
      lat: 41.0082, 
      lng: 28.9784,
      currentStore: 'Market A',
      lastUpdate: '10:30'
    },
    { 
      id: 2, 
      name: 'Mehmet Demir', 
      status: 'visiting', 
      avatar: 'https://i.pravatar.cc/150?img=2',
      lat: 41.0122, 
      lng: 28.9744,
      currentStore: 'Market B',
      lastUpdate: '10:45'
    },
    // ... daha fazla merchandiser eklenebilir
  ],
  stores: [
    { id: 1, name: 'Market A', lat: 41.0122, lng: 28.9764 },
    { id: 2, name: 'Market B', lat: 41.0152, lng: 28.9744 },
    // ... daha fazla market eklenebilir
  ],
};

const visitStats = [
  { name: 'Pzt', completed: 12, planned: 15, rate: 80 },
  { name: 'Sal', completed: 15, planned: 15, rate: 100 },
  { name: 'Çar', completed: 18, planned: 20, rate: 90 },
  { name: 'Per', completed: 14, planned: 18, rate: 78 },
  { name: 'Cum', completed: 16, planned: 16, rate: 100 },
];

const performanceData = [
  { name: 'Raf Düzeni', value: 85 },
  { name: 'Stok Kontrolü', value: 92 },
  { name: 'Sipariş', value: 78 },
];

const COLORS = ['#FF6B00', '#E0E0E0'];

function Dashboard() {
  const [selectedOrg, setSelectedOrg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMerchandisers, setFilteredMerchandisers] = useState(dummyData.merchandisers);

  useEffect(() => {
    const filtered = dummyData.merchandisers.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMerchandisers(filtered);
  }, [searchTerm]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return '#4CAF50';
      case 'visiting': return '#2196F3';
      case 'break': return '#FF9800';
      case 'leave': return '#E91E63';
      default: return '#9E9E9E';
    }
  };

  return (
    <Grid container spacing={3} sx={{ p: 0 }}>
      <Grid item xs={12} md={9}>
        <DashboardContainer>
          <MapSection>
            <MapContainer
              center={[41.0082, 28.9784]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {dummyData.merchandisers.map(m => (
                <Marker 
                  key={m.id}
                  position={[m.lat, m.lng]}
                  icon={merchandiserIcon}
                >
                  <Popup>
                    <div>
                      <strong>{m.name}</strong>
                      <br />
                      Mağaza: {m.currentStore}
                      <br />
                      Son Güncelleme: {m.lastUpdate}
                    </div>
                  </Popup>
                </Marker>
              ))}
              {dummyData.stores.map(s => (
                <Marker 
                  key={s.id}
                  position={[s.lat, s.lng]}
                >
                  <Popup>{s.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </MapSection>
          
          <ChartsSection>
            <ChartCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Haftalık Ziyaret Performansı</Typography>
              </Box>
              <LineChart width={350} height={200} data={visitStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#FF6B00" name="Tamamlanan" />
                <Line type="monotone" dataKey="planned" stroke="#9E9E9E" name="Planlanan" />
              </LineChart>
            </ChartCard>

            <ChartCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorefrontIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Mağaza Dağılımı</Typography>
              </Box>
              <PieChart width={350} height={200}>
                <Pie
                  data={performanceData}
                  cx={170}
                  cy={100}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#FF6B00', '#2196F3', '#4CAF50'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartCard>

            <ChartCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Ziyaret Süreleri</Typography>
              </Box>
              <BarChart width={350} height={200} data={visitStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rate" fill="#FF6B00" name="Verimlilik %" />
              </BarChart>
            </ChartCard>
          </ChartsSection>
        </DashboardContainer>
      </Grid>

      <Grid item xs={12} md={3}>
        <SidePanel>
          <StatsContainer>
            <StatBox color="#4CAF50">
              <Typography variant="subtitle2">Çevrimiçi</Typography>
              <Typography variant="h4">5</Typography>
            </StatBox>
            <StatBox color="#2196F3">
              <Typography variant="subtitle2">Ziyarette</Typography>
              <Typography variant="h4">3</Typography>
            </StatBox>
            <StatBox color="#FF9800">
              <Typography variant="subtitle2">Molada</Typography>
              <Typography variant="h4">2</Typography>
            </StatBox>
            <StatBox color="#E91E63">
              <Typography variant="subtitle2">İzinde</Typography>
              <Typography variant="h4">1</Typography>
            </StatBox>
            <StatBox color="#9E9E9E">
              <Typography variant="subtitle2">Offline</Typography>
              <Typography variant="h4">4</Typography>
            </StatBox>
          </StatsContainer>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControl fullWidth size="small">
              <InputLabel>Organizasyon</InputLabel>
              <Select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                startAdornment={<FilterListIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="org1">Organizasyon 1</MenuItem>
                <MenuItem value="org2">Organizasyon 2</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            size="small"
            label="Merchandiser Ara"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />

          <List sx={{ 
            maxHeight: 400, 
            overflow: 'auto', 
            bgcolor: 'background.paper',
            borderRadius: 1,
            '& .MuiListItem-root': {
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              '&:last-child': {
                borderBottom: 'none',
              },
            },
          }}>
            {filteredMerchandisers.map((m) => (
              <ListItem key={m.id} sx={{ gap: 1 }}>
                <ListItemAvatar>
                  <Avatar src={m.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {m.name}
                      <Chip
                        size="small"
                        label={m.status}
                        sx={{
                          bgcolor: getStatusColor(m.status),
                          color: '#fff',
                          height: 20,
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {m.currentStore}
                      </Typography>
                      <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary', ml: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {m.lastUpdate}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </SidePanel>
      </Grid>
    </Grid>
  );
}

export default Dashboard; 