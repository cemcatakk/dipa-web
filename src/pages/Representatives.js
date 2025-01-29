import { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

// Dummy data
const initialRepresentatives = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    avatar: 'https://i.pravatar.cc/150?img=33',
    phone: '+90 532 111 22 33',
    lastLocation: 'Kadıköy, İstanbul',
    company: 'Gürsoy Fındık',
    group: 'A Grubu',
    status: 'active',
    lastActive: '10 dk önce',
    authorityType: 'super_admin', // Üst Düzey Yetki
  },
  {
    id: 2,
    name: 'Ayşe Demir',
    avatar: 'https://i.pravatar.cc/150?img=44',
    phone: '+90 533 222 33 44',
    lastLocation: 'Üsküdar, İstanbul',
    company: 'Ülker',
    group: 'B Grubu',
    status: 'active',
    lastActive: '25 dk önce',
    authorityType: 'admin', // Yönetici Yetki
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    avatar: 'https://i.pravatar.cc/150?img=12',
    phone: '+90 535 333 44 55',
    lastLocation: 'Çankaya, Ankara',
    company: 'Eti',
    group: 'A Grubu',
    status: 'inactive',
    lastActive: '2 saat önce',
    authorityType: 'normal', // Normal Yetki
  },
  {
    id: 4,
    name: 'Zeynep Şahin',
    avatar: 'https://i.pravatar.cc/150?img=45',
    phone: '+90 536 444 55 66',
    lastLocation: 'Karşıyaka, İzmir',
    company: 'Torku',
    group: 'C Grubu',
    status: 'active',
    lastActive: '5 dk önce'
  },
  {
    id: 5,
    name: 'Ali Yıldız',
    avatar: 'https://i.pravatar.cc/150?img=67',
    phone: '+90 537 555 66 77',
    lastLocation: 'Nilüfer, Bursa',
    company: 'Nestle',
    group: 'B Grubu',
    status: 'active',
    lastActive: '1 saat önce'
  },
  {
    id: 6,
    name: 'Fatma Öztürk',
    avatar: 'https://i.pravatar.cc/150?img=43',
    phone: '+90 538 666 77 88',
    lastLocation: 'Muratpaşa, Antalya',
    company: 'Gürsoy Fındık',
    group: 'A Grubu',
    status: 'active',
    lastActive: '15 dk önce'
  },
  // ... daha fazla temsilci eklenebilir
];

const companies = ['Tümü', 'Gürsoy Fındık', 'Ülker', 'Eti', 'Torku', 'Nestle'];
const groups = ['Tümü', 'A Grubu', 'B Grubu', 'C Grubu'];
const statuses = ['Tümü', 'Aktif', 'Pasif'];

// Yetki tipleri için sabit
const authorityTypes = [
  { value: 'normal', label: 'Normal Yetki', color: 'default' },
  { value: 'admin', label: 'Yönetici Yetki', color: 'primary' },
  { value: 'super_admin', label: 'Üst Düzey Yetki', color: 'error' }
];

function Representatives() {
  const [representatives, setRepresentatives] = useState(initialRepresentatives);
  const [filters, setFilters] = useState({
    search: '',
    company: 'Tümü',
    group: 'Tümü',
    status: 'Tümü'
  });
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [newRepresentative, setNewRepresentative] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: '',
    avatar: null,
  });

  const handleFilterChange = (field) => (event) => {
    const newFilters = { ...filters, [field]: event.target.value };
    setFilters(newFilters);
  };

  const filteredRepresentatives = representatives.filter(rep => {
    if (filters.search && !rep.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.company !== 'Tümü' && rep.company !== filters.company) return false;
    if (filters.group !== 'Tümü' && rep.group !== filters.group) return false;
    if (filters.status !== 'Tümü') {
      const isActive = filters.status === 'Aktif';
      if (rep.status === 'active' !== isActive) return false;
    }
    return true;
  });

  const handleEdit = (repId) => {
    navigate(`/temsilciler/duzenle/${repId}`);
  };

  const handleDelete = (repId) => {
    setRepresentatives(representatives.filter(rep => rep.id !== repId));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h1">
          Temsilciler
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          sx={{ color: '#fff' }}
        >
          Yeni Temsilci
        </Button>
      </Box>

      {/* Filtreler */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Temsilci Ara..."
              value={filters.search}
              onChange={handleFilterChange('search')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Firma</InputLabel>
              <Select
                value={filters.company}
                label="Firma"
                onChange={handleFilterChange('company')}
              >
                {companies.map(company => (
                  <MenuItem key={company} value={company}>{company}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Temsilci Grubu</InputLabel>
              <Select
                value={filters.group}
                label="Temsilci Grubu"
                onChange={handleFilterChange('group')}
              >
                {groups.map(group => (
                  <MenuItem key={group} value={group}>{group}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select
                value={filters.status}
                label="Durum"
                onChange={handleFilterChange('status')}
              >
                {statuses.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Temsilci Kartları */}
      <Grid container spacing={3}>
        {filteredRepresentatives.map((rep) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={rep.id}>
            <Card sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              '&:hover': {
                boxShadow: 6
              }
            }}>
              <Box sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8, 
                display: 'flex',
                gap: 1
              }}>
                <IconButton 
                  size="small"
                  onClick={() => handleEdit(rep.id)}
                  sx={{ 
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small"
                  onClick={() => handleDelete(rep.id)}
                  sx={{ 
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <Avatar
                  src={rep.avatar}
                  sx={{ width: 100, height: 100, mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  {rep.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {rep.lastLocation}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {rep.phone}
                  </Typography>
                </Box>
                <Box sx={{ mt: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Chip 
                    label={rep.company}
                    size="small"
                    color="primary"
                  />
                  <Chip 
                    label={rep.group}
                    size="small"
                    variant="outlined"
                  />
                  <Chip 
                    label={rep.status === 'active' ? 'Aktif' : 'Pasif'}
                    size="small"
                    color={rep.status === 'active' ? 'success' : 'default'}
                  />
                  <Chip 
                    label={authorityTypes.find(at => at.value === rep.authorityType)?.label}
                    size="small"
                    color={authorityTypes.find(at => at.value === rep.authorityType)?.color}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Son aktivite: {rep.lastActive}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Yeni Temsilci Ekle
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <TextField
                  fullWidth
                  label="Ad"
                  value={newRepresentative.firstName}
                  onChange={(e) => setNewRepresentative({ 
                    ...newRepresentative, 
                    firstName: e.target.value 
                  })}
                />
                <TextField
                  fullWidth
                  label="Soyad"
                  value={newRepresentative.lastName}
                  onChange={(e) => setNewRepresentative({ 
                    ...newRepresentative, 
                    lastName: e.target.value 
                  })}
                />
                <TextField
                  fullWidth
                  label="E-posta"
                  type="email"
                  value={newRepresentative.email}
                  onChange={(e) => setNewRepresentative({ 
                    ...newRepresentative, 
                    email: e.target.value 
                  })}
                />
                <TextField
                  fullWidth
                  label="Telefon"
                  value={newRepresentative.phone}
                  onChange={(e) => setNewRepresentative({ 
                    ...newRepresentative, 
                    phone: e.target.value 
                  })}
                />
                <FormControl fullWidth>
                  <InputLabel>Kullanıcı Türü</InputLabel>
                  <Select
                    value={newRepresentative.userType}
                    label="Kullanıcı Türü"
                    onChange={(e) => setNewRepresentative({ 
                      ...newRepresentative, 
                      userType: e.target.value 
                    })}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="manager">Yönetici</MenuItem>
                    <MenuItem value="representative">Temsilci</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={newRepresentative.avatar ? URL.createObjectURL(newRepresentative.avatar) : null}
                />
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                >
                  Resim Seç
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setNewRepresentative({ 
                      ...newRepresentative, 
                      avatar: e.target.files[0] 
                    })}
                  />
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>İptal</Button>
          <Button 
            variant="contained"
            onClick={() => {
              console.log('Yeni temsilci:', newRepresentative);
              setOpenModal(false);
            }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Representatives; 