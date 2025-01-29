import { useState } from 'react';
import { Box, Paper, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Divider, IconButton } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import DeleteIcon from '@mui/icons-material/Delete';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import StoreIcon from '@mui/icons-material/Store';
import CloseIcon from '@mui/icons-material/Close';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet için default ikonları düzeltme
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Market ikonu için özel ikon oluşturma
const marketIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #FF6B00; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
    <svg viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: white;">
      <path d="M18.36 9l.6 3H5.04l.6-3h12.72M20 4H4v2h16V4zm0 3H4l-1 5v2h1v6h10v-6h4v6h2v-6h1v-2l-1-5zM6 18v-4h6v4H6z"/>
    </svg>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

// Dummy firma verileri
const companies = [
  { id: 1, name: "Gürsoy Fındık" },
  { id: 2, name: "Ülker" },
  { id: 3, name: "Eti" },
  { id: 4, name: "Torku" },
  { id: 5, name: "Nestle" }
];

const initialMarkets = [
  { 
    id: 1, 
    name: "A101 Kadıköy", 
    lat: 40.9901, 
    lng: 29.0291, 
    address: "Kadıköy Merkez",
    companies: [1, 2, 3] // Firma ID'leri
  },
  { 
    id: 2, 
    name: "BİM Üsküdar", 
    lat: 41.0249, 
    lng: 29.0164, 
    address: "Üsküdar Merkez",
    companies: [2, 4, 5]
  },
  // ... diğer marketler için de companies array'i ekleyin
  { 
    id: 3, 
    name: "Migros Beşiktaş", 
    lat: 41.0422, 
    lng: 29.0059, 
    address: "Beşiktaş Merkez",
    companies: [1, 3, 5]
  },
  // ... diğer marketler
];

// Market dummy resmi için URL (örnek bir resim)
const MARKET_IMAGE_URL = "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&q=80";

function AddMarkerToClick({ onMarkerAdd }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMarkerAdd({ lat, lng });
    },
  });
  return null;
}

function Markets() {
  const [markets, setMarkets] = useState(initialMarkets);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [newMarket, setNewMarket] = useState({
    name: '',
    address: '',
    lat: null,
    lng: null,
    companies: []
  });
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [mapRef, setMapRef] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleAddMarkerClick = () => {
    setIsAddingMarker(true);
  };

  const handleMarkerAdd = (location) => {
    setNewMarket(prev => ({
      ...prev,
      lat: location.lat,
      lng: location.lng
    }));
    setIsAddingMarker(false);
    setIsAddDialogOpen(true);
  };

  const handleMarketClick = (market) => {
    if (mapRef) {
      mapRef.flyTo([market.lat, market.lng], 14);
      setSelectedMarker(market); // Seçilen marketi state'e kaydet
    }
  };

  const handleAddMarket = () => {
    if (newMarket.name && newMarket.lat && newMarket.lng) {
      setMarkets(prev => [...prev, {
        id: Date.now(),
        ...newMarket,
        companies: newMarket.companies // Artık kullanıcının seçtiği firmaları kullanıyoruz
      }]);
      setNewMarket({
        name: '',
        address: '',
        lat: null,
        lng: null,
        companies: []
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteMarket = (id) => {
    setMarkets(prev => prev.filter(market => market.id !== id));
  };

  // Firma seçimine göre marketleri filtreleme
  const filteredMarkets = selectedCompany 
    ? markets.filter(market => market.companies.includes(Number(selectedCompany)))
    : markets;

  // Marker bileşenine referans almak için
  const markerRefs = {};

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 88px)' }}>
      <Paper sx={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
        {/* Sol Panel - Market Listesi */}
        <Box sx={{ width: 350, borderRight: '1px solid #eee', overflow: 'auto' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Marketler</Typography>
            
            {/* Firma Filtresi */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Firma Seçin</InputLabel>
              <Select
                value={selectedCompany}
                label="Firma Seçin"
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <MenuItem value="">
                  <em>Tümü</em>
                </MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              fullWidth
              variant="contained"
              startIcon={<AddLocationIcon />}
              onClick={handleAddMarkerClick}
              color={isAddingMarker ? "secondary" : "primary"}
            >
              {isAddingMarker ? "Haritada Konum Seçin" : "Market Ekle"}
            </Button>
          </Box>
          
          <Box sx={{ p: 2 }}>
            {filteredMarkets.map((market) => (
              <Box
                key={market.id}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 1,
                  bgcolor: 'background.default',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
                onClick={() => handleMarketClick(market)}
              >
                <Typography variant="subtitle1">{market.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {market.address}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {market.companies.map(companyId => {
                    const company = companies.find(c => c.id === companyId);
                    return company ? (
                      <Typography
                        key={company.id}
                        variant="caption"
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.7rem'
                        }}
                      >
                        {company.name}
                      </Typography>
                    ) : null;
                  })}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Sağ Panel - Harita */}
        <Box sx={{ flexGrow: 1 }}>
          <MapContainer
            center={[41.0082, 28.9784]}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
            ref={setMapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredMarkets.map((market) => (
              <Marker
                key={market.id}
                position={[market.lat, market.lng]}
                icon={marketIcon}
                ref={(ref) => {
                  if (ref) {
                    markerRefs[market.id] = ref;
                    // Eğer bu marker seçili ise popup'ı aç
                    if (selectedMarker && selectedMarker.id === market.id) {
                      ref.openPopup();
                    }
                  }
                }}
              >
                <Popup
                  closeButton={false}
                >
                  <Box sx={{ width: 200 }}>
                    <Box sx={{ position: 'relative' }}>
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          right: -12,
                          top: -12,
                          bgcolor: 'white',
                          boxShadow: 1,
                          '&:hover': {
                            bgcolor: 'grey.100'
                          },
                          zIndex: 1
                        }}
                        onClick={() => {
                          if (markerRefs[market.id]) {
                            markerRefs[market.id].closePopup();
                          }
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                      <img 
                        src={MARKET_IMAGE_URL} 
                        alt={market.name}
                        style={{ 
                          width: '100%', 
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: '4px',
                          marginBottom: '8px'
                        }}
                      />
                    </Box>
                    <Typography 
                      variant="subtitle2"
                      sx={{ 
                        fontWeight: 'bold',
                        color: 'primary.main' 
                      }}
                    >
                      {market.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        mb: 1,
                        fontSize: '0.8rem'
                      }}
                    >
                      {market.address}
                    </Typography>
                    <Divider sx={{ my: 0.5 }} />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                        display: 'block',
                        mb: 0.5,
                        fontSize: '0.7rem'
                      }}
                    >
                      Çalışma Firmaları:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {market.companies.map(companyId => {
                        const company = companies.find(c => c.id === companyId);
                        return company ? (
                          <Typography
                            key={company.id}
                            variant="caption"
                            sx={{
                              bgcolor: 'primary.main',
                              color: 'white',
                              px: 0.5,
                              py: 0.25,
                              borderRadius: 1,
                              fontSize: '0.65rem'
                            }}
                          >
                            {company.name}
                          </Typography>
                        ) : null;
                      })}
                    </Box>
                    <Box sx={{ 
                      mt: 0.5,
                      p: 0.5,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      fontSize: '0.65rem',
                      color: 'text.secondary'
                    }}>
                      <Typography variant="caption">
                        Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
                      </Typography>
                    </Box>
                  </Box>
                </Popup>
              </Marker>
            ))}
            {isAddingMarker && <AddMarkerToClick onMarkerAdd={handleMarkerAdd} />}
          </MapContainer>
        </Box>
      </Paper>

      {/* Market Ekleme Dialog */}
      <Dialog 
        open={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            position: 'relative'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          fontSize: '1.1rem'
        }}>
          Yeni Market Ekle
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              label="Market Adı"
              fullWidth
              size="small"
              value={newMarket.name}
              onChange={(e) => setNewMarket(prev => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              label="Adres"
              fullWidth
              size="small"
              value={newMarket.address}
              onChange={(e) => setNewMarket(prev => ({ ...prev, address: e.target.value }))}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Firmalar</InputLabel>
              <Select
                multiple
                value={newMarket.companies}
                onChange={(e) => setNewMarket(prev => ({ ...prev, companies: e.target.value }))}
                label="Firmalar"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((companyId) => {
                      const company = companies.find(c => c.id === companyId);
                      return company ? (
                        <Typography
                          key={company.id}
                          variant="caption"
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.7rem'
                          }}
                        >
                          {company.name}
                        </Typography>
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setIsAddDialogOpen(false)}
            variant="outlined"
            color="inherit"
            size="small"
          >
            İptal
          </Button>
          <Button 
            onClick={handleAddMarket} 
            variant="contained"
            disabled={!newMarket.name || !newMarket.companies.length}
            size="small"
          >
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Markets; 