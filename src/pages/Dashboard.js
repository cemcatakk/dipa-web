import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Paper, TextField, Select, MenuItem, FormControl, InputLabel, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Grid, Chip } from '@mui/material';
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
  gridTemplateColumns: '1fr 1fr',
  gap: 24,
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    height: 'auto',
  },
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

const StatusBox = styled(Box)(({ color }) => ({
  padding: '8px 12px',
  borderRadius: '8px',
  backgroundColor: color,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: 'fit-content',
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

function Dashboard() {
  const [selectedOrg, setSelectedOrg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMerchandisers, setFilteredMerchandisers] = useState(dummyData.merchandisers);
  const [timeRange, setTimeRange] = useState('month');

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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Dashboard
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

      <Grid container spacing={3}>
        {/* Aylık Performans - Çizgi Grafik */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Aylık Performans
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tamamlanan"
                  stroke="#2196F3"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="hedef"
                  stroke="#FF9800"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Performans Dağılımı - Pasta Grafik */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Performans Dağılımı
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="tamamlanan" 
                    stroke="#FF6B00" 
                    strokeWidth={2}
                    name="Tamamlanan"
                    dot={{ stroke: '#FF6B00', strokeWidth: 2, r: 4, fill: '#fff' }}
                    activeDot={{ r: 6, fill: '#FF6B00' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="planlanan" 
                    stroke="#9E9E9E" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Planlanan"
                    dot={{ stroke: '#9E9E9E', strokeWidth: 2, r: 4, fill: '#fff' }}
                  />
                </LineChart>
              </ChartCard>

              <ChartCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StorefrontIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Günlük Hedef Durumu</Typography>
                </Box>
                <Box sx={{ position: 'relative', height: '200px' }}>
                  <PieChart width={350} height={200}>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend 
                      verticalAlign="middle" 
                      align="right"
                      layout="vertical"
                      iconType="circle"
                    />
                  </PieChart>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      position: 'absolute', 
                      left: '50%', 
                      top: '50%', 
                      transform: 'translate(-50%, -50%)',
                      color: '#FF6B00',
                      fontWeight: 'bold'
                    }}
                  >
                    75%
                  </Typography>
                </Box>
              </ChartCard>
            </ChartsSection>
          </DashboardContainer>
        </Grid>

        <Grid item xs={12} md={4}>
          <SidePanel>
            <StatusContainer>
              <StatusBox color="#4CAF50">
                <span className="count">5</span>
                <span className="label">Çevrimiçi</span>
              </StatusBox>
              <StatusBox color="#2196F3">
                <span className="count">3</span>
                <span className="label">Ziyarette</span>
              </StatusBox>
              <StatusBox color="#FF9800">
                <span className="count">2</span>
                <span className="label">Molada</span>
              </StatusBox>
              <StatusBox color="#E91E63">
                <span className="count">1</span>
                <span className="label">İzinde</span>
              </StatusBox>
              <StatusBox color="#9E9E9E">
                <span className="count">4</span>
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
              maxHeight: { xs: '400px', md: 'calc(100vh - 380px)' }, // Mobilde sabit yükseklik
              overflow: 'auto',
              bgcolor: 'background.paper',
              borderRadius: 1,
              '& .MuiListItem-root': {
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                '&:last-child': { borderBottom: 'none' },
              },
            }}>
              {filteredMerchandisers.map((m) => (
                <ListItem key={m.id} sx={{ p: 1 }}>
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
                          Son Ziyaret: 2 saat önce
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
    </Box>
  );
}

export default Dashboard; 