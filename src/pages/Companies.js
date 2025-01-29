import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper,
  Button,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  Chip,
  Stack,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';

const dummyData = [
  { 
    id: 1, 
    name: 'Gürsoy Fındık', 
    totalStores: 125,
    activeMerchandisers: 45,
    region: 'İstanbul',
    status: 'Aktif',
    lastUpdate: '2024-03-15'
  },
  { 
    id: 2, 
    name: 'Johnsons Baby', 
    totalStores: 85,
    activeMerchandisers: 30,
    region: 'Ankara',
    status: 'Aktif',
    lastUpdate: '2024-03-14'
  },
  { 
    id: 3, 
    name: 'Çokomel', 
    totalStores: 42,
    activeMerchandisers: 15,
    region: 'İzmir',
    status: 'Pasif',
    lastUpdate: '2024-03-13'
  },
  { 
    id: 4, 
    name: 'Ülker', 
    totalStores: 93,
    activeMerchandisers: 38,
    region: 'İstanbul',
    status: 'Aktif',
    lastUpdate: '2024-03-15'
  },
  { 
    id: 5, 
    name: 'Tire Süt', 
    totalStores: 67,
    activeMerchandisers: 25,
    region: 'Bursa',
    status: 'Aktif',
    lastUpdate: '2024-03-14'
  },
];

function Companies() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    region: '',
    status: 'Aktif'
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewCompany({ name: '', region: '', status: 'Aktif' });
  };

  const handleSave = () => {
    console.log('Yeni firma:', newCompany);
    handleCloseModal();
  };

  const columns = [
    { 
      field: 'name', 
      headerName: 'Firma Adı', 
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(`/firmalar/${params.row.id}`)}
          sx={{ textDecoration: 'none' }}
        >
          {params.value}
        </Link>
      ),
    },
    { 
      field: 'totalStores', 
      headerName: 'Toplam Market', 
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StorefrontIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'activeMerchandisers', 
      headerName: 'Aktif Merchandiser', 
      width: 180,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'region', 
      headerName: 'Bölge', 
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
        />
      ),
    },
    { 
      field: 'status', 
      headerName: 'Durum', 
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Aktif' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    { 
      field: 'lastUpdate', 
      headerName: 'Son Güncelleme', 
      width: 150,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => {
        return (params.value);
      },
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton 
            onClick={() => navigate(`/firmalar/${params.row.id}/duzenle`)}
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            onClick={() => handleDelete(params.row.id)}
            size="small"
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const handleDelete = (id) => {
    // Silme işlemi
    console.log('Silinecek firma ID:', id);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h1">
          Organizasyonlar
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          sx={{ color: '#fff' }}
        >
          Yeni Organizasyon
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Organizasyon Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
        </Box>

        <DataGrid
          rows={dummyData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
          pageSizeOptions={[25, 50, 100]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f8f8f8',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid #f0f0f0',
            },
          }}
        />
      </Paper>

      {/* Yeni Firma Modal */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #eee',
          fontWeight: 600
        }}>
          Yeni Organizasyon Ekle
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Organizasyon Adı"
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Bölge</InputLabel>
                <Select
                  value={newCompany.region}
                  label="Bölge"
                  onChange={(e) => setNewCompany({ ...newCompany, region: e.target.value })}
                >
                  <MenuItem value="İstanbul">İstanbul</MenuItem>
                  <MenuItem value="Ankara">Ankara</MenuItem>
                  <MenuItem value="İzmir">İzmir</MenuItem>
                  <MenuItem value="Bursa">Bursa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Durum</InputLabel>
                <Select
                  value={newCompany.status}
                  label="Durum"
                  onChange={(e) => setNewCompany({ ...newCompany, status: e.target.value })}
                >
                  <MenuItem value="Aktif">Aktif</MenuItem>
                  <MenuItem value="Pasif">Pasif</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={handleCloseModal} color="inherit">
            İptal
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{ color: '#fff' }}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Companies; 