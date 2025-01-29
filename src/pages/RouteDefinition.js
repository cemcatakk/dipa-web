import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  FormControl,
  Switch,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  Autocomplete,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet için default ikonları düzeltme
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Örnek market listesi
const dummyMarkets = [
  { 
    id: 1, 
    name: 'Market A', 
    address: 'Kadıköy, İstanbul', 
    organization: 'Gürsoy Fındık',
    location: { lat: 40.9909, lng: 29.0307 }
  },
  { 
    id: 2, 
    name: 'Market B', 
    address: 'Üsküdar, İstanbul', 
    organization: 'Ülker',
    location: { lat: 41.0223, lng: 29.0199 }
  },
  // ... daha fazla market
];

// Örnek organizasyonlar
const organizations = [
  { id: 1, name: 'Gürsoy Fındık' },
  { id: 2, name: 'Ülker' },
  // ... daha fazla organizasyon
];

// Önceden tanımlı sorular
const predefinedQuestions = {
  entryForm: [
    { id: 1, question: 'Mağaza temiz ve düzenli mi?', required: true },
    { id: 2, question: 'Giriş yolu açık mı?', required: true },
    { id: 3, question: 'Mağaza yetkilisi ile görüşüldü mü?', required: true },
    { id: 4, question: 'Raf çalışması öncesi görsel', required: true, type: 'image' },
    { id: 5, question: 'Mağaza içi temizlik kontrolü yapıldı mı?', required: false },
  ],
  exitForm: [
    { id: 1, question: 'Raf çalışması sonrası görsel', required: true, type: 'image' },
    { id: 2, question: 'Ürünler düzgün yerleştirildi mi?', required: true },
    { id: 3, question: 'Etiketler kontrol edildi mi?', required: true },
    { id: 4, question: 'Mağaza yetkilisinden onay alındı mı?', required: true },
  ],
};

// Türkçe form başlıkları
const formSections = {
  transportation: { label: 'Ulaşım Bilgisi' },
  entryForm: { label: 'Mağaza Giriş Formu' },
  warehouseStock: { label: 'Depo Ürün Bulunurluğu' },
  shelfOrder: { label: 'Raf Düzeni' },
  expiryCheck: { label: 'SKT Kontrol' },
  productAvailability: { label: 'Ürün Bulunurluğu' },
  competitorProducts: { label: 'Rakip Ürün Bulunurluğu' },
  exitForm: { label: 'Mağaza Çıkış Formu' },
};

function RouteDefinition() {
  const [routeConfig, setRouteConfig] = useState({
    name: '',
    description: '',
    organization: null, // Tek organizasyon
    markets: [],
    transportation: {
      enabled: false
    },
    entryForm: {
      enabled: false,
      questions: []
    },
    warehouseStock: {
      enabled: false,
      file: null
    },
    shelfOrder: {
      enabled: false,
      file: null
    },
    expiryCheck: {
      enabled: false,
      file: null
    },
    productAvailability: {
      enabled: false,
      file: null
    },
    competitorProducts: {
      enabled: false,
      file: null
    },
    exitForm: {
      enabled: false,
      questions: []
    }
  });

  const [openMarketDialog, setOpenMarketDialog] = useState(false);
  const [marketFilters, setMarketFilters] = useState({
    search: '',
    organization: ''
  });

  // Market filtreleme fonksiyonu
  const filteredMarkets = dummyMarkets.filter(market => {
    const matchesSearch = market.name.toLowerCase().includes(marketFilters.search.toLowerCase()) ||
                         market.address.toLowerCase().includes(marketFilters.search.toLowerCase());
    const matchesOrg = !marketFilters.organization || market.organization === marketFilters.organization;
    return matchesSearch && matchesOrg;
  });

  const handleFileUpload = (section) => (event) => {
    const file = event.target.files[0];
    setRouteConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        file
      }
    }));
  };

  const toggleSection = (section) => {
    setRouteConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        enabled: !prev[section].enabled
      }
    }));
  };

  const toggleQuestion = (section, questionId) => {
    setRouteConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        questions: prev[section].questions.includes(questionId)
          ? prev[section].questions.filter(id => id !== questionId)
          : [...prev[section].questions, questionId]
      }
    }));
  };

  // Harita merkezi için hesaplama
  const getMapCenter = () => {
    if (routeConfig.markets.length === 0) {
      return [41.0082, 28.9784]; // İstanbul merkezi
    }
    
    const lats = routeConfig.markets.map(m => m.location.lat);
    const lngs = routeConfig.markets.map(m => m.location.lng);
    
    return [
      (Math.max(...lats) + Math.min(...lats)) / 2,
      (Math.max(...lngs) + Math.min(...lngs)) / 2
    ];
  };

  // Harita zoom seviyesi için hesaplama
  const getBounds = () => {
    if (routeConfig.markets.length === 0) return null;
    
    const lats = routeConfig.markets.map(m => m.location.lat);
    const lngs = routeConfig.markets.map(m => m.location.lng);
    
    return [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)]
    ];
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Rut Tanımı</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {/* Temel Bilgiler */}
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                label="Rut Adı"
                value={routeConfig.name}
                onChange={(e) => setRouteConfig(prev => ({ ...prev, name: e.target.value }))}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Açıklama"
                multiline
                rows={2}
                value={routeConfig.description}
                onChange={(e) => setRouteConfig(prev => ({ ...prev, description: e.target.value }))}
              />
            </Box>

            {/* Organizasyon Seçimi - Tekli seçim */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom>Organizasyon</Typography>
              <Autocomplete
                options={organizations}
                getOptionLabel={(option) => option.name}
                value={routeConfig.organization}
                onChange={(e, newValue) => setRouteConfig(prev => ({ 
                  ...prev, 
                  organization: newValue 
                }))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Organizasyon seçin"
                  />
                )}
              />
            </Box>

            {/* Market Seçimi */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">Marketler</Typography>
                <Button
                  variant="outlined"
                  startIcon={<StorefrontIcon />}
                  onClick={() => setOpenMarketDialog(true)}
                >
                  Market Ekle
                </Button>
              </Box>
              {routeConfig.markets.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {routeConfig.markets.map((market) => (
                    <Chip
                      key={market.id}
                      label={market.name}
                      onDelete={() => {
                        setRouteConfig(prev => ({
                          ...prev,
                          markets: prev.markets.filter(m => m.id !== market.id)
                        }));
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Henüz market seçilmedi
                </Typography>
              )}
            </Box>

            {/* Form Bölümleri */}
            {Object.entries(formSections).map(([key, { label }]) => (
              <Box key={key} sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={routeConfig[key]?.enabled}
                      onChange={() => toggleSection(key)}
                    />
                  }
                  label={label}
                />
                {key !== 'transportation' && routeConfig[key]?.enabled && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                    >
                      Excel Yükle
                      <input
                        type="file"
                        hidden
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload(key)}
                      />
                    </Button>
                    {routeConfig[key].file && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {routeConfig[key].file.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setRouteConfig(prev => ({
                            ...prev,
                            [key]: { ...prev[key], file: null }
                          }))}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Sağ Panel - Özet */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 88 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Rut Özeti</Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Organizasyon"
                  secondary={routeConfig.organization?.name || 'Seçilmedi'}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Seçili Market Sayısı"
                  secondary={routeConfig.markets.length || 0}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Aktif Özellikler"
                  secondary={Object.entries(routeConfig)
                    .filter(([key, value]) => value?.enabled)
                    .length}
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Harita */}
            <Typography variant="subtitle2" gutterBottom>
              Market Konumları
            </Typography>
            <Box sx={{ 
              height: 200, 
              mb: 2,
              border: '1px solid #eee',
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              <MapContainer
                center={getMapCenter()}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                bounds={getBounds()}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {routeConfig.markets.map((market, index) => (
                  <Marker
                    key={market.id}
                    position={[market.location.lat, market.location.lng]}
                  >
                    <Popup>
                      <Typography variant="subtitle2">
                        {index + 1}. {market.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {market.address}
                      </Typography>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Seçili Marketler
            </Typography>
            {routeConfig.markets.length > 0 ? (
              <List dense>
                {routeConfig.markets.map((market, index) => (
                  <ListItem key={market.id}>
                    <ListItemText
                      primary={`${index + 1}. ${market.name}`}
                      secondary={market.address}
                      secondaryTypographyProps={{ 
                        variant: 'caption',
                        color: 'text.secondary'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Henüz market seçilmedi
              </Typography>
            )}

            <Box sx={{ mt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => console.log('Rut Konfigürasyonu:', routeConfig)}
                sx={{ 
                  height: 48,
                  color: '#fff',
                  fontWeight: 500
                }}
              >
                Kaydet
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Market Seçim Modalı */}
      <Dialog
        open={openMarketDialog}
        onClose={() => setOpenMarketDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Market Seçimi</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Market Ara..."
                  value={marketFilters.search}
                  onChange={(e) => setMarketFilters(prev => ({ ...prev, search: e.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Organizasyon</InputLabel>
                  <Select
                    value={marketFilters.organization}
                    label="Organizasyon"
                    onChange={(e) => setMarketFilters(prev => ({ 
                      ...prev, 
                      organization: e.target.value 
                    }))}
                  >
                    <MenuItem value="">Tümü</MenuItem>
                    {organizations.map(org => (
                      <MenuItem key={org.id} value={org.name}>{org.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredMarkets.map((market) => (
              <ListItem
                key={market.id}
                button
                onClick={() => {
                  if (!routeConfig.markets.find(m => m.id === market.id)) {
                    setRouteConfig(prev => ({
                      ...prev,
                      markets: [...prev.markets, market]
                    }));
                  }
                }}
              >
                <ListItemText
                  primary={market.name}
                  secondary={`${market.address} • ${market.organization}`}
                />
                <Checkbox
                  edge="end"
                  checked={routeConfig.markets.some(m => m.id === market.id)}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMarketDialog(false)}>Tamam</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default RouteDefinition; 