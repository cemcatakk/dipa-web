import { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Paper, TextField, Select, MenuItem, FormControl, InputLabel, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Grid, Chip, IconButton } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area,
  ResponsiveContainer 
} from 'recharts';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from 'react-router-dom';

// Leaflet için default ikonları düzeltme
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom Merchandiser marker'ı güncelliyoruz
const createMerchandiserIcon = (avatarUrl) => {
  return new L.divIcon({
    className: 'custom-merchandiser-marker',
    html: `
      <div style="
        background-image: url('${avatarUrl}');
        background-size: cover;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid #FF6B00;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      "></div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const DashboardContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: '0',
  height: 'calc(100vh - 88px)',
});

const MapSection = styled(Paper)(({ theme }) => ({
  height: 'calc(100vh - 180px)',
  overflow: 'hidden',
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const ChartsSection = styled(Box)(({ theme }) => ({
  height: '40%',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 24,
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    height: 'auto',
  },
}));

const SidePanel = styled(Paper)(({ theme }) => ({
  height: 'calc(100vh - 180px)',
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  overflow: 'hidden',
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
  '& .recharts-wrapper': {
    width: '100% !important',
    height: '100% !important',
    minHeight: '200px',
    '& svg': {
      width: '100% !important',
      height: '100% !important',
    },
  },
}));

const StatsBox = styled(Paper)(({ theme }) => ({
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  borderRadius: 8,
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  transition: 'transform 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
}));

const IconWrapper = styled(Box)(({ color }) => ({
  width: 40,
  height: 40,
  borderRadius: 8,
  backgroundColor: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    color: '#fff',
    fontSize: 24,
  },
}));

const dummyData = {
  merchandisers: [
    { 
      id: 1, 
      name: 'Ahmet Yılmaz', 
      status: 'çevrimiçi', 
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      lat: 41.0082, 
      lng: 28.9584,
      currentStore: 'Market A',
      lastUpdate: '10:30',
      lastVisit: '2 saat önce'
    },
    { 
      id: 2, 
      name: 'Mehmet Demir', 
      status: 'ziyarette', 
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      lat: 41.0122, 
      lng: 28.9344,
      currentStore: 'Market B',
      lastUpdate: '10:45',
      lastVisit: '1 saat önce'
    },
    { 
      id: 3, 
      name: 'Ayşe Kaya', 
      status: 'break', 
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      lat: 41.0082, 
      lng: 28.9124,
      currentStore: 'Market C',
      lastUpdate: '11:00',
      lastVisit: '30 dakika önce'
    },
    { 
      id: 4, 
      name: 'Fatma Şahin', 
      status: 'çevrimiçi', 
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      lat: 41.0082, 
      lng: 28.9004,
      currentStore: 'Market D',
      lastUpdate: '11:15',
      lastVisit: '45 dakika önce'
    },
    { 
      id: 5, 
      name: 'Ali Yıldız', 
      status: 'leave', 
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      lat: 41.0132, 
      lng: 28.9764,
      currentStore: 'Market E',
      lastUpdate: '11:30',
      lastVisit: '3 saat önce'
    }
  ],
  stores: [
    { id: 1, name: 'Market A', lat: 41.0132, lng: 28.9684 },
    { id: 2, name: 'Market B', lat: 41.0022, lng: 28.9244 },
    { id: 3, name: 'Market C', lat: 41.0052, lng: 28.9124 },
    { id: 4, name: 'Market D', lat: 41.0092, lng: 28.9004 },
    { id: 5, name: 'Market E', lat: 41.0032, lng: 28.9364 },
    { id: 6, name: 'Market F', lat: 41.0072, lng: 28.9224 },
    { id: 7, name: 'Market G', lat: 41.0012, lng: 28.9184 },
    { id: 8, name: 'Market H', lat: 41.0052, lng: 28.9044 }
  ],
};

const visitStats = [
  { name: 'Pzt', tamamlanan: 15, planlanan: 18 },
  { name: 'Sal', tamamlanan: 22, planlanan: 25 },
  { name: 'Çar', tamamlanan: 28, planlanan: 30 },
  { name: 'Per', tamamlanan: 19, planlanan: 22 },
  { name: 'Cum', tamamlanan: 25, planlanan: 25 },
];

const pieData = [
  { name: 'Tamamlanan', value: 75, color: '#FF6B00' },
  { name: 'Bekleyen', value: 25, color: '#E0E0E0' },
];

const COLORS = ['#FF6B00', '#E0E0E0'];

const StatusContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '8px',
  marginBottom: '16px',
  flexWrap: 'nowrap',
  overflowX: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  scrollbarWidth: 'none',
}));

const StatusBox = styled(Box)(({ color, selected }) => ({
  padding: '8px 12px',
  borderRadius: '8px',
  backgroundColor: color,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: 'fit-content',
  cursor: 'pointer',
  transition: 'all 0.2s',
  opacity: selected ? 1 : 0.5,
  transform: selected ? 'scale(1.02)' : 'scale(1)',
  border: selected ? '2px solid #fff' : '2px solid transparent',
  boxShadow: selected ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
  '&:hover': {
    opacity: 1,
    transform: 'scale(1.02)',
  },
  '& .count': {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  '& .label': {
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
  },
}));

const monthlyData = [
  { name: 'Ocak', tamamlanan: 65, hedef: 80 },
  { name: 'Şubat', tamamlanan: 75, hedef: 80 },
  { name: 'Mart', tamamlanan: 85, hedef: 80 },
  { name: 'Nisan', tamamlanan: 70, hedef: 80 },
  { name: 'Mayıs', tamamlanan: 90, hedef: 80 },
  { name: 'Haziran', tamamlanan: 95, hedef: 80 },
];

const performanceData = [
  { name: 'Tamamlanan', value: 85, color: '#4CAF50' },
  { name: 'İptal', value: 5, color: '#f44336' },
  { name: 'Bekleyen', value: 10, color: '#FFC107' },
];

const dailyVisits = [
  { date: '01/03', ziyaret: 24 },
  { date: '02/03', ziyaret: 18 },
  { date: '03/03', ziyaret: 27 },
  { date: '04/03', ziyaret: 23 },
  { date: '05/03', ziyaret: 29 },
  { date: '06/03', ziyaret: 30 },
  { date: '07/03', ziyaret: 26 },
];

const regionData = [
  { bolge: 'Kadıköy', deger: 85 },
  { bolge: 'Üsküdar', deger: 75 },
  { bolge: 'Beşiktaş', deger: 90 },
  { bolge: 'Şişli', deger: 65 },
  { bolge: 'Maltepe', deger: 70 },
];

// Günlük ziyaret performans verisi
const dailyVisitPerformance = [
  { tarih: '12 Mar', hedef: 25, ziyaret: 22 },
  { tarih: '13 Mar', hedef: 30, ziyaret: 28 },
  { tarih: '14 Mar', hedef: 28, ziyaret: 25 },
  { tarih: '15 Mar', hedef: 32, ziyaret: 30 },
  { tarih: '16 Mar', hedef: 35, ziyaret: 33 },
  { tarih: '17 Mar', hedef: 25, ziyaret: 24 },
  { tarih: '18 Mar', hedef: 20, ziyaret: 20 },
];

// Son 1 saatteki aktivite dağılımı
const activityDistribution = [
  { name: 'Ziyarette', value: 12, color: '#2196F3' },
  { name: 'Çevrimiçi', value: 8, color: '#4CAF50' },
  { name: 'Molada', value: 3, color: '#FF9800' },
  { name: 'İzinde', value: 2, color: '#E91E63' },
];

function Dashboard() {
  const [selectedOrg, setSelectedOrg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMerchandisers, setFilteredMerchandisers] = useState(dummyData.merchandisers);
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMerchandiser, setSelectedMerchandiser] = useState(null);
  const mapRef = useRef(null);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const navigate = useNavigate();
  
  // Status counts hesaplama
  const statusCounts = {
    çevrimiçi: dummyData.merchandisers.filter(m => m.status === 'çevrimiçi').length,
    visiting: dummyData.merchandisers.filter(m => m.status === 'visiting').length,
    break: dummyData.merchandisers.filter(m => m.status === 'break').length,
    leave: dummyData.merchandisers.filter(m => m.status === 'leave').length,
    offline: dummyData.merchandisers.filter(m => m.status === 'offline').length,
  };

  useEffect(() => {
    let filtered = dummyData.merchandisers;
    
    // Önce arama filtresini uygula
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sonra status filtrelerini uygula
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(m => selectedStatuses.includes(m.status));
    }
    
    setFilteredMerchandisers(filtered);
  }, [searchTerm, selectedStatuses]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'çevrimiçi': return '#4CAF50';
      case 'ziyarette': return '#2196F3';
      case 'break': return '#FF9800';
      case 'leave': return '#E91E63';
      default: return '#9E9E9E';
    }
  };

  const handleMerchandiserClick = (merchandiser) => {
    setSelectedMerchandiser(merchandiser.id);
    mapRef.current?.setView([merchandiser.lat, merchandiser.lng], 15, {
      animate: true,
      duration: 1
    });
  };

  const handleStatusClick = (status) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        // Status zaten seçiliyse kaldır
        return prev.filter(s => s !== status);
      } else {
        // Status seçili değilse ekle
        return [...prev, status];
      }
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0 }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
      Kuşbakışı
          </Typography>
       
      </Box>


      <Grid 
        container 
        spacing={2} 
        sx={{ 
          p: 2,
          height: '100%',
          flexDirection: { xs: 'column-reverse', md: 'row' } // Mobilde sağ panel üstte olacak
        }}
      >
        <Grid item xs={12} md={8}>
          <DashboardContainer>
            <MapSection>
              <MapContainer
                center={[41.0082, 28.9784]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {dummyData.merchandisers.map(m => (
                  <Marker 
                    key={m.id}
                    position={[m.lat, m.lng]}
                    icon={createMerchandiserIcon(m.avatar)}
                  >
                    <Popup>
                      <Box sx={{ p: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Avatar src={m.avatar} sx={{ width: 32, height: 32 }} />
                          <Typography variant="subtitle2">{m.name}</Typography>
                        </Box>
                        <Typography variant="body2">
                          <strong>Mağaza:</strong> {m.currentStore}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Son Güncelleme:</strong> {m.lastUpdate}
                        </Typography>
                      </Box>
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
            
          </DashboardContainer>
        </Grid>

        <Grid item xs={12} md={4}>
          <SidePanel>
            <StatusContainer>
              <StatusBox 
                color="#4CAF50" 
                selected={selectedStatuses.includes('çevrimiçi')}
                onClick={() => handleStatusClick('çevrimiçi')}
              >
                <span className="count">{statusCounts.çevrimiçi}</span>
                <span className="label">Çevrimiçi</span>
              </StatusBox>
              <StatusBox 
                color="#2196F3" 
                selected={selectedStatuses.includes('visiting')}
                onClick={() => handleStatusClick('visiting')}
              >
                <span className="count">{statusCounts.visiting}</span>
                <span className="label">Ziyarette</span>
              </StatusBox>
              <StatusBox 
                color="#FF9800" 
                selected={selectedStatuses.includes('break')}
                onClick={() => handleStatusClick('break')}
              >
                <span className="count">{statusCounts.break}</span>
                <span className="label">Molada</span>
              </StatusBox>
              <StatusBox 
                color="#E91E63" 
                selected={selectedStatuses.includes('leave')}
                onClick={() => handleStatusClick('leave')}
              >
                <span className="count">{statusCounts.leave}</span>
                <span className="label">İzinde</span>
              </StatusBox>
              <StatusBox 
                color="#9E9E9E" 
                selected={selectedStatuses.includes('offline')}
                onClick={() => handleStatusClick('offline')}
              >
                <span className="count">{statusCounts.offline}</span>
                <span className="label">Offline</span>
              </StatusBox>
            </StatusContainer>

            <Box sx={{ mt: 0 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
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
                placeholder="Merchandiser Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Box>

            <List sx={{ 
              mt: 0,
              flex: 1,
              overflow: 'auto',
              bgcolor: 'background.paper',
              borderRadius: 1,
              '& .MuiListItem-root': {
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                '&:last-child': { borderBottom: 'none' },
              },
            }}>
              {filteredMerchandisers.map((m) => (
                <ListItem 
                  key={m.id} 
                  onClick={() => handleMerchandiserClick(m)}
                  sx={{ 
                    p: 1.5,
                    cursor: 'pointer',
                    bgcolor: selectedMerchandiser === m.id ? 'rgba(255, 107, 0, 0.08)' : 'transparent',
                    '&:hover': {
                      bgcolor: selectedMerchandiser === m.id 
                        ? 'rgba(255, 107, 0, 0.12)' 
                        : 'rgba(255, 107, 0, 0.04)',
                    },
                    transition: 'background-color 0.2s',
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar src={m.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {m.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {m.currentStore}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        size="small"
                        label={m.status}
                        sx={{
                          bgcolor: getStatusColor(m.status),
                          color: '#fff',
                          height: 24,
                        }}
                      />
                       <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/mesajlar');
                        }}
                      >
                        <ChatIcon />
                      </IconButton>
                    </Box>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      mt: 1,
                      p: 1,
                      bgcolor: 'rgba(0,0,0,0.02)',
                      borderRadius: 1,
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        <Typography variant="caption">
                          Son Ziyaret: {m.lastVisit}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption">
                          Çevrimiçi: {m.lastUpdate}
                        </Typography>
                      </Box>
                    </Box>
                   
                  </Box>
                </ListItem>
              ))}
            </List>
          </SidePanel>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
      Performans Metrikleri
          </Typography>
          <FormControl size="small" sx={{ width: 150 }}>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">Son 7 Gün</MenuItem>
            <MenuItem value="month">Son 30 Gün</MenuItem>
            <MenuItem value="year">Son 1 Yıl</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2}>
        
        {/* Günlük Ziyaret Performansı */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant="h6" sx={{ 
              mb: 2,
              fontWeight: 500,
              color: '#1a1a1a'
            }}>
              Günlük Ziyaret Performansı
            </Typography>
            <Box sx={{ flex: 1, minHeight: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyVisitPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis 
                    dataKey="tarih" 
                    tick={{ fill: '#666' }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis 
                    tick={{ fill: '#666' }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    iconType="circle"
                  />
                  <Bar 
                    dataKey="hedef" 
                    fill="#FF9800" 
                    radius={[4, 4, 0, 0]}
                    name="Hedef"
                    fillOpacity={0.2}
                    stroke="#FF9800"
                    strokeWidth={1}
                  />
                  <Bar 
                    dataKey="ziyaret" 
                    fill="#2196F3" 
                    radius={[4, 4, 0, 0]}
                    name="Ziyaret"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Aktivite Dağılımı */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant="h6" sx={{ 
              mb: 2,
              fontWeight: 500,
              color: '#1a1a1a'
            }}>
              Son 1 Saatteki Aktivite Dağılımı
            </Typography>
            <Box sx={{ 
              flex: 1, 
              minHeight: 300,
              display: 'flex',
              alignItems: 'center'
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {activityDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                    formatter={(value, name) => [`${value} Kişi`, name]}
                  />
                  <Legend 
                    verticalAlign="middle" 
                    align="right"
                    layout="vertical"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>


        {/* Günlük Ziyaretler - Alan Grafik */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Günlük Ziyaretler
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyVisits}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="ziyaret"
                  stroke="#4CAF50"
                  fill="#4CAF50"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Bölge Performansı - Bar Grafik */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Bölge Performansı
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bolge" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="deger" fill="#3F51B5">
                  {regionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.deger >= 80 ? '#4CAF50' : entry.deger >= 70 ? '#FFC107' : '#f44336'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

      </Grid>

    </Box>
  );
}

export default Dashboard; 