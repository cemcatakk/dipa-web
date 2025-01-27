import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  IconButton,
  Tooltip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';

// dayjs'i Türkçe olarak ayarlayalım
dayjs.locale('tr');

const dummyData = [
  {
    id: 1,
    name: 'Mağaza Giriş Formu',
    date: '2024-03-15',
    merchandiserCode: 'M001',
    merchandiser: 'Ahmet Yılmaz',
    customerCode: 'C001',
    customer: 'Market A',
    createdAt: '2024-03-15 10:30',
    formType: 'entry',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Mağaza Çıkış Formu',
    date: '2024-03-15',
    merchandiserCode: 'M001',
    merchandiser: 'Ahmet Yılmaz',
    customerCode: 'C001',
    customer: 'Market A',
    createdAt: '2024-03-15 11:45',
    formType: 'exit',
    status: 'approved',
  },
  {
    id: 3,
    name: 'Raf Düzeni Formu',
    date: '2024-03-15',
    merchandiserCode: 'M002',
    merchandiser: 'Mehmet Demir',
    customerCode: 'C002',
    customer: 'Market B',
    createdAt: '2024-03-15 13:20',
    formType: 'shelf',
    status: 'pending',
  },
  {
    id: 4,
    name: 'Depo Kontrol Formu',
    date: '2024-03-15',
    merchandiserCode: 'M002',
    merchandiser: 'Mehmet Demir',
    customerCode: 'C002',
    customer: 'Market B',
    createdAt: '2024-03-15 14:15',
    formType: 'warehouse',
    status: 'approved',
  },
];

const formTypes = [
  { id: 'entry', label: 'Mağaza Giriş' },
  { id: 'exit', label: 'Mağaza Çıkış' },
  { id: 'shelf', label: 'Raf Düzeni' },
  { id: 'warehouse', label: 'Depo Kontrol' },
];

function Forms() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    formType: '',
    company: '',
    merchandiser: '',
    dateRange: [null, null],
  });
  const [showFilters, setShowFilters] = useState(false);

  const columns = [
    { 
      field: 'name', 
      headerName: 'Form Adı', 
      flex: 1,
      minWidth: 200,
    },
    { 
      field: 'date', 
      headerName: 'Tarih',
      width: 120,
    },
    { 
      field: 'merchandiserCode', 
      headerName: 'Temsilci Kodu',
      width: 130,
    },
    { 
      field: 'merchandiser', 
      headerName: 'Temsilci',
      width: 150,
    },
    { 
      field: 'customerCode', 
      headerName: 'Müşteri Kodu',
      width: 130,
    },
    { 
      field: 'customer', 
      headerName: 'Müşteri',
      width: 150,
    },
    { 
      field: 'createdAt', 
      headerName: 'Kayıt Tarihi',
      width: 160,
    },
    { 
      field: 'status', 
      headerName: 'Durum',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value === 'approved' ? 'Onaylandı' : 'Bekliyor'}
          color={params.value === 'approved' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
  ];

  const handleApprove = () => {
    console.log('Onaylanacak formlar:', selectedRows);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      formType: '',
      company: '',
      merchandiser: '',
      dateRange: [null, null],
    });
  };

  const datePickerSection = (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
          <DatePicker
            label="Başlangıç Tarihi"
            value={filters.dateRange[0]}
            onChange={(newValue) => setFilters({ 
              ...filters, 
              dateRange: [newValue, filters.dateRange[1]]
            })}
            slotProps={{ 
              textField: { 
                size: 'small', 
                fullWidth: true,
                inputProps: {
                  placeholder: 'GG.AA.YYYY'
                }
              } 
            }}
            format="DD.MM.YYYY"
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
          <DatePicker
            label="Bitiş Tarihi"
            value={filters.dateRange[1]}
            onChange={(newValue) => setFilters({ 
              ...filters, 
              dateRange: [filters.dateRange[0], newValue]
            })}
            slotProps={{ 
              textField: { 
                size: 'small', 
                fullWidth: true,
                inputProps: {
                  placeholder: 'GG.AA.YYYY'
                }
              } 
            }}
            format="DD.MM.YYYY"
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );

  const filterSection = showFilters && (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Form Türü</InputLabel>
          <Select
            value={filters.formType}
            label="Form Türü"
            onChange={(e) => setFilters({ ...filters, formType: e.target.value })}
          >
            <MenuItem value="">Tümü</MenuItem>
            {formTypes.map(type => (
              <MenuItem key={type.id} value={type.id}>{type.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Firma</InputLabel>
          <Select
            value={filters.company}
            label="Firma"
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value="1">ABC Market</MenuItem>
            <MenuItem value="2">XYZ Market</MenuItem>
            <MenuItem value="3">123 Market</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Merchandiser</InputLabel>
          <Select
            value={filters.merchandiser}
            label="Merchandiser"
            onChange={(e) => setFilters({ ...filters, merchandiser: e.target.value })}
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value="M001">Ahmet Yılmaz</MenuItem>
            <MenuItem value="M002">Mehmet Demir</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        {datePickerSection}
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h1">
          Formlar
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<DescriptionIcon />}
            onClick={() => {}}
          >
            Form Şablonları
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {}}
            sx={{ color: '#fff' }}
          >
            Yeni Form
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Ara..."
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
          {Object.values(filters).some(x => x !== '' && x !== null) && (
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
          checkboxSelection
          onRowSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection);
          }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
          }}
        />

        {selectedRows.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={handleApprove}
              sx={{ color: '#fff' }}
            >
              Seçilenleri Onayla ({selectedRows.length})
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Forms; 