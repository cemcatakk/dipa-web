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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';

const dummyData = [
  { 
    id: 1, 
    name: 'ABC Market Zinciri', 
    totalStores: 125,
    activeMerchandisers: 45,
    region: 'İstanbul',
    status: 'Aktif',
    lastUpdate: '2024-03-15'
  },
  { 
    id: 2, 
    name: 'XYZ Marketleri', 
    totalStores: 85,
    activeMerchandisers: 30,
    region: 'Ankara',
    status: 'Aktif',
    lastUpdate: '2024-03-14'
  },
  { 
    id: 3, 
    name: 'Mega Gross Market', 
    totalStores: 42,
    activeMerchandisers: 15,
    region: 'İzmir',
    status: 'Pasif',
    lastUpdate: '2024-03-13'
  },
  { 
    id: 4, 
    name: 'Happy Center', 
    totalStores: 93,
    activeMerchandisers: 38,
    region: 'İstanbul',
    status: 'Aktif',
    lastUpdate: '2024-03-15'
  },
  { 
    id: 5, 
    name: 'Anadolu Markets', 
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
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          cursor: 'pointer',
          '&:hover': { color: 'primary.main' }
        }}
        onClick={() => navigate(`/firmalar/${params.row.id}`)}
        >
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'totalStores', 
      headerName: 'Toplam Market', 
      width: 150,
      align: 'center',
      headerAlign: 'center',
    },
    { 
      field: 'activeMerchandisers', 
      headerName: 'Aktif Merchandiser', 
      width: 180,
      align: 'center',
      headerAlign: 'center',
    },
    { 
      field: 'region', 
      headerName: 'Bölge', 
      width: 150,
      align: 'center',
      headerAlign: 'center',
    },
    { 
      field: 'status', 
      headerName: 'Durum', 
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: params.value === 'Aktif' ? '#4CAF50' : '#FF5722',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.75rem',
          }}
        >
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'lastUpdate', 
      headerName: 'Son Güncelleme', 
      width: 150,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => {
        return params.value;
      },
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Görüntüle">
            <IconButton 
              onClick={() => navigate(`/firmalar/${params.row.id}`)}
              size="small"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Düzenle">
            <IconButton 
              onClick={() => navigate(`/firmalar/${params.row.id}/duzenle`)}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sil">
            <IconButton 
              onClick={() => handleDelete(params.row.id)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleDelete = (id) => {
    // Silme işlemi
    console.log('Silinecek firma ID:', id);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
            Firmalar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Toplam {dummyData.length} firma listeleniyor
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          sx={{ 
            color: '#fff',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Yeni Firma
        </Button>
      </Box>

      <Paper sx={{ 
        p: 2, 
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Firma Ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <DataGrid
          rows={dummyData}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
          disableSelectionOnClick
          autoHeight
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
          Yeni Firma Ekle
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Firma Adı"
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