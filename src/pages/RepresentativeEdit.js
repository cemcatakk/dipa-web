import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

const companies = ['Gürsoy Fındık', 'Ülker', 'Eti', 'Torku', 'Nestle'];
const groups = ['A Grubu', 'B Grubu', 'C Grubu'];
const statuses = ['active', 'inactive'];

const authorityTypes = [
  { value: 'normal', label: 'Normal Yetki', color: 'default' },
  { value: 'admin', label: 'Yönetici Yetki', color: 'primary' },
  { value: 'super_admin', label: 'Üst Düzey Yetki', color: 'error' }
];

// Dummy data - Representatives.js'den alındı
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
    lastActive: '10 dk önce'
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
    lastActive: '25 dk önce'
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
    lastActive: '2 saat önce'
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
  }
];

function RepresentativeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [representative, setRepresentative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Gerçek uygulamada API'den veri çekilecek
    const rep = initialRepresentatives.find(r => r.id === Number(id));
    if (rep) {
      setRepresentative(rep);
    } else {
      setError('Temsilci bulunamadı');
    }
    setLoading(false);
  }, [id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Gerçek uygulamada API'ye gönderilecek
    console.log('Güncellenen veri:', representative);
    navigate('/temsilciler');
  };

  if (loading) return <Box sx={{ p: 3 }}>Yükleniyor...</Box>;
  if (error) return <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* Üst Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/temsilciler')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Temsilci Düzenle</Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Sol Kolon - Profil Resmi */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={representative.avatar}
                  sx={{ width: 200, height: 200 }}
                />
                <Button variant="outlined" component="label">
                  Fotoğraf Değiştir
                  <input type="file" hidden accept="image/*" />
                </Button>
              </Box>
            </Grid>

            {/* Sağ Kolon - Form */}
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ad Soyad"
                    value={representative.name}
                    onChange={(e) => setRepresentative({ ...representative, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Telefon"
                    value={representative.phone}
                    onChange={(e) => setRepresentative({ ...representative, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Firma</InputLabel>
                    <Select
                      value={representative.company}
                      label="Firma"
                      onChange={(e) => setRepresentative({ ...representative, company: e.target.value })}
                    >
                      {companies.map(company => (
                        <MenuItem key={company} value={company}>{company}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Grup</InputLabel>
                    <Select
                      value={representative.group}
                      label="Grup"
                      onChange={(e) => setRepresentative({ ...representative, group: e.target.value })}
                    >
                      {groups.map(group => (
                        <MenuItem key={group} value={group}>{group}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Durum</InputLabel>
                    <Select
                      value={representative.status}
                      label="Durum"
                      onChange={(e) => setRepresentative({ ...representative, status: e.target.value })}
                    >
                      <MenuItem value="active">Aktif</MenuItem>
                      <MenuItem value="inactive">Pasif</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Temsilci Tipi</InputLabel>
                    <Select
                      value={representative.authorityType}
                      label="Temsilci Tipi"
                      onChange={(e) => setRepresentative({ ...representative, authorityType: e.target.value })}
                    >
                      {authorityTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    if (window.confirm('Temsilciyi silmek istediğinize emin misiniz?')) {
                      navigate('/temsilciler');
                    }
                  }}
                >
                  Sil
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  type="submit"
                >
                  Kaydet
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default RepresentativeEdit; 