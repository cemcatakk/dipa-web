import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  InputAdornment,
  Link,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import StorefrontIcon from '@mui/icons-material/Storefront';

const dummyData = [
  {
    id: 1,
    company: 'ABC Market Zinciri',
    name: 'ABC Market Kadıköy',
    code: 'ABC001',
    group: 'Süpermarket',
    type: 'Şube',
    representative: 'Ahmet Yılmaz',
    status: 'active',
  },
  {
    id: 2,
    company: 'ABC Market Zinciri',
    name: 'ABC Market Merkez',
    code: 'ABC000',
    group: 'Süpermarket',
    type: 'Merkez',
    representative: 'Mehmet Demir',
    status: 'active',
  },
  {
    id: 3,
    company: 'XYZ Marketleri',
    name: 'XYZ Market Üsküdar',
    code: 'XYZ001',
    group: 'Zincir Market',
    type: 'Şube',
    representative: 'Ali Yıldız',
    status: 'passive',
  },
  // ... daha fazla örnek veri
];

const customerGroups = [
  'Süpermarket',
  'Zincir Market',
  'Bakkal',
  'Gross Market',
];

function Customers() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    company: '',
    group: '',
    type: '',
    status: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const columns = [
    { 
      field: 'company', 
      headerName: 'Firma', 
      width: 180,
    },
    { 
      field: 'name', 
      headerName: 'Müşteri Adı', 
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(`/musteriler/${params.row.id}`)}
          sx={{ textDecoration: 'none' }}
        >
          {params.value}
        </Link>
      ),
    },
    { 
      field: 'code', 
      headerName: 'Kod',
      width: 120,
    },
    { 
      field: 'group', 
      headerName: 'Müşteri Grubu',
      width: 150,
    },
    { 
      field: 'type', 
      headerName: 'Merkez/Şube',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Merkez' ? 'primary' : 'default'}
          size="small"
          variant="outlined"
        />
      ),
    },
    { 
      field: 'representative', 
      headerName: 'Temsilci',
      width: 150,
    },
    { 
      field: 'status', 
      headerName: 'Durum',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value === 'active' ? 'Aktif' : 'Pasif'}
          color={params.value === 'active' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
  ];

  const clearFilters = () => {
    setFilters({
      search: '',
      company: '',
      group: '',
      type: '',
      status: '',
    });
  };

  const filterSection = showFilters && (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Firma</InputLabel>
          <Select
            value={filters.company}
            label="Firma"
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value="ABC">ABC Market Zinciri</MenuItem>
            <MenuItem value="XYZ">XYZ Marketleri</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Müşteri Grubu</InputLabel>
          <Select
            value={filters.group}
            label="Müşteri Grubu"
            onChange={(e) => setFilters({ ...filters, group: e.target.value })}
          >
            <MenuItem value="">Tümü</MenuItem>
            {customerGroups.map(group => (
              <MenuItem key={group} value={group}>{group}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Merkez/Şube</InputLabel>
          <Select
            value={filters.type}
            label="Merkez/Şube"
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value="Merkez">Merkez</MenuItem>
            <MenuItem value="Şube">Şube</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Durum</InputLabel>
          <Select
            value={filters.status}
            label="Durum"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value="active">Aktif</MenuItem>
            <MenuItem value="passive">Pasif</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h1">
          Müşteriler
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => navigate('/musteriler/tanimlar')}
          >
            Tanımlar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/musteriler/yeni')}
            sx={{ color: '#fff' }}
          >
            Yeni Müşteri
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Müşteri Ara..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtreler
          </Button>
          {Object.values(filters).some(x => x !== '') && (
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
            >
              Temizle
            </Button>
          )}
        </Box>

        {filterSection}

        <DataGrid
          rows={dummyData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
          pageSizeOptions={[25, 50, 100]}
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
          }}
        />
      </Paper>
    </Box>
  );
}

export default Customers; 