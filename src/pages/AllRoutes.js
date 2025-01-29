import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  InputAdornment,
  LinearProgress,
  IconButton,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';

dayjs.locale('tr');

const dummyData = [
  {
    id: 1,
    name: 'İstanbul-Kadıköy Rotası',
    date: '2024-03-15',
    merchandiser: {
      id: 1,
      name: 'Ahmet Yılmaz',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    status: 'in_progress',
    progress: 65,
    totalStores: 8,
    completedStores: 5,
    startTime: '09:00',
    endTime: '17:00',
    region: 'İstanbul-Anadolu',
  },
  {
    id: 2,
    name: 'İstanbul-Beşiktaş Rotası',
    date: '2024-03-15',
    merchandiser: {
      id: 2,
      name: 'Mehmet Demir',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    status: 'completed',
    progress: 100,
    totalStores: 6,
    completedStores: 6,
    startTime: '10:00',
    endTime: '16:30',
    region: 'İstanbul-Avrupa',
  },
  {
    id: 3,
    name: 'İstanbul-Üsküdar Rotası',
    date: '2024-03-15',
    merchandiser: {
      id: 3,
      name: 'Ali Yıldız',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    status: 'pending',
    progress: 0,
    totalStores: 7,
    completedStores: 0,
    startTime: '11:00',
    endTime: '18:00',
    region: 'İstanbul-Anadolu',
  },
  {
    id: 4,
    name: 'İstanbul-Bakırköy Rotası',
    date: '2024-03-15',
    merchandiser: {
      id: 4,
      name: 'Ayşe Kara',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    status: 'in_progress',
    progress: 33,
    totalStores: 9,
    completedStores: 3,
    startTime: '09:30',
    endTime: '17:30',
    region: 'İstanbul-Avrupa',
  },
  {
    id: 5,
    name: 'İstanbul-Maltepe Rotası',
    date: '2024-03-15',
    merchandiser: {
      id: 5,
      name: 'Zeynep Ak',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    status: 'cancelled',
    progress: 0,
    totalStores: 5,
    completedStores: 0,
    startTime: '10:30',
    endTime: '16:00',
    region: 'İstanbul-Anadolu',
  }
];

const statusOptions = [
  { value: 'pending', label: 'Bekliyor', color: 'default' },
  { value: 'in_progress', label: 'Devam Ediyor', color: 'primary' },
  { value: 'completed', label: 'Tamamlandı', color: 'success' },
  { value: 'cancelled', label: 'İptal Edildi', color: 'error' },
];

function AllRoutes() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    region: '',
    date: null,
    merchandiser: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedMerchandiser, setSelectedMerchandiser] = useState(null);

  const columns = [
    {
      field: 'name',
      headerName: 'Rut Adı',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': { color: 'primary.main' },
          }}
          onClick={() => navigate(`/rutlar/${params.row.id}`)}
        >
          <StorefrontIcon fontSize="small" />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'merchandiser',
      headerName: 'Merchandiser',
      width: 250,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          width: '100%',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={params.value.avatar}
              sx={{ width: 24, height: 24 }}
            />
            <Typography variant="body2">{params.value.name}</Typography>
          </Box>
          <Tooltip title="Merchandiser Değiştir">
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                // Merchandiser değiştirme modalını aç
              }}
            >
              <SwapHorizIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Durum',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const status = statusOptions.find(s => s.value === params.value);
        return (
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Chip
              label={status.label}
              color={status.color}
              size="small"
            />
          </Box>
        );
      },
    },
    {
      field: 'progress',
      headerName: 'İlerleme',
      width: 200,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 1, 
          width: '100%',
          px: 1
        }}>
          <LinearProgress
            variant="determinate"
            value={params.value}
            sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
          />
          <Typography variant="body2" sx={{ minWidth: 50 }}>
            {`${params.row.completedStores}/${params.row.totalStores}`}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'region',
      headerName: 'Bölge',
      width: 150,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'time',
      headerName: 'Saat',
      width: 150,
      align: 'center',
      alignItems: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          width: '100%',
          justifyContent: 'center'
        }}>
          <AccessTimeIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {params.row.startTime} - {params.row.endTime}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 50,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <IconButton size="small">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      region: '',
      date: null,
      merchandiser: '',
    });
  };

  const filterSection = showFilters && (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Durum</InputLabel>
          <Select
            value={filters.status}
            label="Durum"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <MenuItem value="">Tümü</MenuItem>
            {statusOptions.map(status => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Bölge</InputLabel>
          <Select
            value={filters.region}
            label="Bölge"
            onChange={(e) => setFilters({ ...filters, region: e.target.value })}
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value="istanbul-anadolu">İstanbul-Anadolu</MenuItem>
            <MenuItem value="istanbul-avrupa">İstanbul-Avrupa</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
          <DatePicker
            label="Tarih"
            value={filters.date}
            onChange={(newValue) => setFilters({ ...filters, date: newValue })}
            slotProps={{ 
              textField: { 
                size: 'small',
                fullWidth: true,
              } 
            }}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Merchandiser</InputLabel>
          <Select
            value={filters.merchandiser}
            label="Merchandiser"
            onChange={(e) => setFilters({ ...filters, merchandiser: e.target.value })}
          >
            <MenuItem value="">Tümü</MenuItem>
            <MenuItem value="1">Ahmet Yılmaz</MenuItem>
            <MenuItem value="2">Mehmet Demir</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  // Henüz atanmamış rutlar
  const unassignedRoutes = [
    { id: 1, name: 'Kadıköy-1 Rotası', stores: 8, region: 'İstanbul' },
    { id: 2, name: 'Beşiktaş-2 Rotası', stores: 6, region: 'İstanbul' },
    // ... daha fazla rut
  ];

  // Bugün rutu olmayan merchandiserlar
  const availableMerchandisers = [
    { id: 1, name: 'Ahmet Yılmaz', region: 'İstanbul', avatar: 'url' },
    { id: 2, name: 'Ayşe Kaya', region: 'İstanbul', avatar: 'url' },
    // ... daha fazla merchandiser
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h1">
          Rutlar
        </Typography>
        <Stack direction="row" spacing={1}>
          {selectedRows.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                // Seçili rutları iptal et
                console.log('İptal edilecek rutlar:', selectedRows);
              }}
            >
              Seçilenleri İptal Et ({selectedRows.length})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAssignModal(true)}
          >
            Yeni Rut Ata
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate('/rutlar/tanimla')}
          >
            Rut Tanımla
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Rut Ara..."
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
              paginationModel: { pageSize: 25 },
            },
          }}
          pageSizeOptions={[25, 50, 100]}
          autoHeight
          disableRowSelectionOnClick
          rowHeight={52}
          headerHeight={48}
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              lineHeight: '20px',
              py: 1,
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#fafafa',
              borderBottom: '2px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              lineHeight: '20px',
            },
            '& .MuiDataGrid-columnHeader': {
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600,
              lineHeight: '20px',
            },
            '& .MuiDataGrid-columnHeaderCheckbox, & .MuiDataGrid-cellCheckbox': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            },
            '& .MuiAvatar-root, & .MuiSvgIcon-root': {
              flexShrink: 0,
            },
            '& .MuiChip-root': {
              height: 24,
              flexShrink: 0,
            },
          }}
        />
      </Paper>

      <Dialog
        open={openAssignModal}
        onClose={() => setOpenAssignModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Yeni Rut Ata
          <IconButton
            onClick={() => setOpenAssignModal(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Sol Panel - Rutlar */}
            <Grid item xs={6}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                Atanabilir Rutlar
              </Typography>
              <Paper sx={{ height: 400, overflow: 'auto' }}>
                <List>
                  {unassignedRoutes.map((route) => (
                    <ListItem
                      key={route.id}
                      button
                      selected={selectedRoute?.id === route.id}
                      onClick={() => setSelectedRoute(route)}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: 'primary.light',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                          },
                        },
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemText
                        primary={route.name}
                        secondary={`${route.stores} Market • ${route.region}`}
                        primaryTypographyProps={{
                          color: selectedRoute?.id === route.id ? 'primary.main' : 'inherit',
                          fontWeight: selectedRoute?.id === route.id ? 500 : 400,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Sağ Panel - Merchandiserlar */}
            <Grid item xs={6}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                Uygun Merchandiserlar
              </Typography>
              <Paper sx={{ height: 400, overflow: 'auto' }}>
                <List>
                  {availableMerchandisers.map((merchandiser) => (
                    <ListItem
                      key={merchandiser.id}
                      button
                      selected={selectedMerchandiser?.id === merchandiser.id}
                      onClick={() => setSelectedMerchandiser(merchandiser)}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: 'primary.light',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                          },
                        },
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={merchandiser.avatar} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={merchandiser.name}
                        secondary={merchandiser.region}
                        primaryTypographyProps={{
                          color: selectedMerchandiser?.id === merchandiser.id ? 'primary.main' : 'inherit',
                          fontWeight: selectedMerchandiser?.id === merchandiser.id ? 500 : 400,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignModal(false)}>İptal</Button>
          <Button
            variant="contained"
            disabled={!selectedRoute || !selectedMerchandiser}
            onClick={() => {
              // Rut atama işlemi
              console.log('Atanan Rut:', selectedRoute);
              console.log('Atanan Merchandiser:', selectedMerchandiser);
              setOpenAssignModal(false);
            }}
          >
            Rut Ata
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AllRoutes; 