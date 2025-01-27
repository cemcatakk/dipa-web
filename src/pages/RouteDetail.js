import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Tabs,
  Tab,
  Divider,
  Stack,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import StorefrontIcon from '@mui/icons-material/Storefront';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import CategoryIcon from '@mui/icons-material/Category';
import CompareIcon from '@mui/icons-material/Compare';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'leaflet/dist/leaflet.css';
import ProductTable from '../components/ProductTable';
import StoreChecklistForm from '../components/StoreChecklistForm';

const dummyData = {
  id: 101,
  name: 'İstanbul-Kadıköy Rotası',
  merchandiser: {
    name: 'Ahmet Yılmaz',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  date: '2024-03-15',
  summary: {
    startTime: '10:00',
    endTime: '17:30',
    duration: '7s 30d',
    status: 'in_progress',
    totalStores: 6,
    completedStores: 2,
    note: 'Rut genel olarak planlandığı gibi ilerliyor.',
  },
  stores: [
    {
      id: 1,
      name: 'Market A',
      status: 'completed',
      visitTime: '10:30',
      location: { lat: 41.0082, lng: 28.9784 },
      transportation: {
        type: 'metro',
        cost: 15.50,
        receipt: 'receipt1.jpg',
        timestamp: '2024-03-15 10:15',
        notes: 'Kadıköy-Kartal metrosu kullanıldı',
      },
      warehouseData: [
        { code: 'GRS001', name: 'Gürsoy Çikolata 80g', status: 'var', quantity: 45, lastCheck: '10:35' },
        { code: 'GRS002', name: 'Gürsoy Fındık 150g', status: 'az', quantity: 8, lastCheck: '10:35' },
        // ... daha fazla ürün
      ],
      shelfData: [
        { code: 'GRS001', name: 'Gürsoy Çikolata 80g', status: 'var', expiry: '2024-12', notes: 'Raf düzeni uygun' },
        { code: 'GRS002', name: 'Gürsoy Fındık 150g', status: 'var', expiry: '2024-10', notes: 'SKT yaklaşıyor' },
        // ... daha fazla ürün
      ],
      gursoyData: [
        { code: 'GRS001', name: 'Gürsoy Çikolata 80g', status: 'var', price: '12.50', stock: '45' },
        { code: 'GRS002', name: 'Gürsoy Fındık 150g', status: 'az', price: '25.90', stock: '8' },
        // ... daha fazla ürün
      ],
      competitorData: [
        { code: 'CMP001', name: 'Rakip Çikolata A', status: 'var', price: '11.90', stock: '30' },
        { code: 'CMP002', name: 'Rakip Fındık B', status: 'yok', price: '-', stock: '0' },
        // ... daha fazla ürün
      ],
      entryForm: [
        {
          question: 'Mağaza yetkilisi ile görüşüldü mü?',
          answer: true,
          required: true,
          note: 'Mağaza müdürü Mehmet Bey ile görüşüldü',
        },
        {
          question: 'Raf çalışması öncesi görsel',
          answer: 'Görseller eklendi',
          required: true,
          images: [
            'https://picsum.photos/200/300?random=1',
            'https://picsum.photos/200/300?random=2',
          ],
        },
        {
          question: 'Mağaza içi temizlik kontrolü yapıldı mı?',
          answer: true,
          required: false,
        },
      ],
      exitForm: [
        {
          question: 'Raf çalışması sonrası görsel',
          answer: 'Görseller eklendi',
          required: true,
          images: [
            'https://picsum.photos/200/300?random=3',
            'https://picsum.photos/200/300?random=4',
          ],
        },
        {
          question: 'Mağaza yetkilisinden onay alındı mı?',
          answer: true,
          required: true,
          note: 'İmzalı form ekte',
        },
      ],
    },
    {
      id: 2,
      name: 'Market B',
      status: 'in_progress',
      visitTime: '11:45',
      location: { lat: 41.0122, lng: 28.9744 },
      transportation: {
        type: 'bus',
        cost: 12.75,
        receipt: 'receipt2.jpg',
        timestamp: '2024-03-15 11:30',
        notes: '14B otobüs hattı kullanıldı',
      },
    },
    // ... daha fazla market
  ],
};

const formOptions = [
  { id: 'transportation', label: 'Ulaşım Bilgisi', icon: <DirectionsCarIcon /> },
  { id: 'store_entry', label: 'Mağaza Giriş Formu', icon: <StorefrontIcon /> },
  { id: 'warehouse', label: 'Depo Ürün Bulunurluğu', icon: <WarehouseIcon /> },
  { id: 'shelf', label: 'Raf Düzeni ve SKT Kontrol', icon: <CategoryIcon /> },
  { id: 'gursoy', label: 'Gürsoy Ürün Bulunurluğu', icon: <CategoryIcon /> },
  { id: 'competitor', label: 'Rakip Ürün Bulunurluğu', icon: <CompareIcon /> },
  { id: 'store_exit', label: 'Mağaza Çıkış Formu', icon: <LogoutIcon /> },
];

const getTransportIcon = (type) => {
  switch(type) {
    case 'bus': return <DirectionsBusIcon />;
    case 'metro': return <DirectionsSubwayIcon />;
    case 'taxi': return <LocalTaxiIcon />;
    default: return <DirectionsCarIcon />;
  }
};

const getStatusColor = (status) => {
  switch(status) {
    case 'completed': return '#4CAF50';
    case 'in_progress': return '#2196F3';
    case 'pending': return '#9E9E9E';
    default: return '#9E9E9E';
  }
};

const getStatusText = (status) => {
  switch(status) {
    case 'completed': return 'Tamamlandı';
    case 'in_progress': return 'Devam Ediyor';
    case 'pending': return 'Bekliyor';
    default: return 'Bekliyor';
  }
};

function RouteDetail() {
  const { id } = useParams();
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedForm, setSelectedForm] = useState('transportation');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mapOpen, setMapOpen] = useState(false);
  const navigate = useNavigate();

  const filteredStores = dummyData.stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || store.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderFormContent = () => {
    if (!selectedStore) return null;

    switch(selectedForm) {
      case 'transportation':
        return renderTransportationDetails();
      case 'store_entry':
        return <StoreChecklistForm type="entry" data={selectedStore.entryForm} />;
      case 'store_exit':
        return <StoreChecklistForm type="exit" data={selectedStore.exitForm} />;
      case 'warehouse':
        return <ProductTable type="warehouse" data={selectedStore.warehouseData} />;
      case 'shelf':
        return <ProductTable type="shelf" data={selectedStore.shelfData} />;
      case 'gursoy':
        return <ProductTable type="gursoy" data={selectedStore.gursoyData} />;
      case 'competitor':
        return <ProductTable type="competitor" data={selectedStore.competitorData} />;
      default:
        return null;
    }
  };

  const renderTransportationDetails = () => {
    if (!selectedStore?.transportation) return null;

    const { type, cost, receipt, timestamp, notes } = selectedStore.transportation;

    return (
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getTransportIcon(type)}
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Ulaşım Detayları
          </Typography>
        </Box>
        <Divider />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Ulaşım Türü
            </Typography>
            <Typography variant="body1">
              {type === 'bus' ? 'Otobüs' : type === 'metro' ? 'Metro' : 'Taksi'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Ücret
            </Typography>
            <Typography variant="body1">
              ₺{cost.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Tarih/Saat
            </Typography>
            <Typography variant="body1">
              {timestamp}
            </Typography>
          </Grid>
          {notes && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Notlar
              </Typography>
              <Typography variant="body1">
                {notes}
              </Typography>
            </Grid>
          )}
          {receipt && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Makbuz
              </Typography>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 1, 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReceiptIcon color="primary" />
                  <Typography variant="body2">
                    Makbuzu Görüntüle
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Stack>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              src={dummyData.merchandiser.avatar}
              sx={{ width: 56, height: 56 }}
            />
          </Grid>
          <Grid item sm={4}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {dummyData.name}
            </Typography>
            <Box 
              component="span" 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' }
              }}
              onClick={() => navigate(`/merchandiserlar/${dummyData.merchandiser.id}`)}
            >
              <Typography variant="body2" color="text.secondary">
                {dummyData.merchandiser.name}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={8} sm="auto">
            <Box sx={{ display: 'flex', gap: 8 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Başlangıç
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {dummyData.summary.startTime}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Bitiş
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {dummyData.summary.endTime}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Süre
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {dummyData.summary.duration}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  İlerleme
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" fontWeight={500}>
                    {Math.round((dummyData.summary.completedStores / dummyData.summary.totalStores) * 100)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(dummyData.summary.completedStores / dummyData.summary.totalStores) * 100}
                    sx={{ width: 100, height: 6, borderRadius: 3 }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Market Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 1 }}
              />
              <FormControl fullWidth size="small">
                <InputLabel>Durum Filtrele</InputLabel>
                <Select
                  value={statusFilter}
                  label="Durum Filtrele"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Tümü</MenuItem>
                  <MenuItem value="completed">Tamamlandı</MenuItem>
                  <MenuItem value="in_progress">Devam Ediyor</MenuItem>
                  <MenuItem value="pending">Bekliyor</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <List sx={{ 
              maxHeight: 'calc(100vh - 350px)', 
              overflow: 'auto',
              '& > *:not(:last-child)': { mb: 1 }
            }}>
              {filteredStores.map((store, index) => (
                <ListItem
                  key={store.id}
                  button
                  selected={selectedStore?.id === store.id}
                  onClick={() => setSelectedStore(store)}
                  sx={{
                    borderRadius: 1,
                    border: '1px solid #eee',
                  }}
                >
                  <Box sx={{ mr: 2, color: 'text.secondary' }}>
                    {index + 1}
                  </Box>
                  <ListItemIcon>
                    <StorefrontIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={store.name}
                    secondary={`Ziyaret: ${store.visitTime}`}
                  />
                  <Chip
                    size="small"
                    label={getStatusText(store.status)}
                    sx={{
                      bgcolor: getStatusColor(store.status),
                      color: '#fff',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Accordion expanded={mapOpen} onChange={() => setMapOpen(!mapOpen)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Harita Görünümü</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Box sx={{ height: 300 }}>
                <MapContainer
                  center={[41.0082, 28.9784]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {selectedStore && (
                    <Marker position={[selectedStore.location.lat, selectedStore.location.lng]}>
                      <Popup>{selectedStore.name}</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedStore ? (
            <Paper sx={{ p: 2 }}>
              <Tabs
                value={selectedForm}
                onChange={(e, newValue) => setSelectedForm(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
              >
                {formOptions.map((option) => (
                  <Tab
                    key={option.id}
                    value={option.id}
                    icon={option.icon}
                    label={option.label}
                    sx={{ minHeight: 'auto', py: 1 }}
                  />
                ))}
              </Tabs>
              {renderFormContent()}
            </Paper>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Lütfen detaylarını görüntülemek için bir market seçin
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default RouteDetail; 