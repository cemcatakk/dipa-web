import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Menu,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/FileDownload';
import UploadIcon from '@mui/icons-material/Upload';
import RouteIcon from '@mui/icons-material/Route';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Dummy kullanıcı verileri güncellendi
const initialUsers = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@dipa.com.tr',
    role: 'admin',
    status: 'active',
    region: 'İstanbul',
    company: 'DIPA'
  },
  {
    id: 2,
    name: 'Mehmet Demir',
    email: 'mehmet@dipa.com.tr',
    role: 'merchandiser',
    status: 'active',
    region: 'Ankara',
    company: 'DIPA'
  },
  {
    id: 3,
    name: 'Ayşe Kaya',
    email: 'ayse@dipa.com.tr',
    role: 'supervisor',
    status: 'active',
    region: 'İzmir',
    company: 'DIPA'
  },
  {
    id: 4,
    name: 'Fatma Şahin',
    email: 'fatma@dipa.com.tr',
    role: 'merchandiser',
    status: 'active',
    region: 'İstanbul',
    company: 'DIPA'
  },
  {
    id: 5,
    name: 'Ali Yıldız',
    email: 'ali@dipa.com.tr',
    role: 'merchandiser',
    status: 'active',
    region: 'Bursa',
    company: 'DIPA'
  },
  {
    id: 6,
    name: 'Zeynep Demir',
    email: 'zeynep@dipa.com.tr',
    role: 'supervisor',
    status: 'active',
    region: 'Antalya',
    company: 'DIPA'
  },
  {
    id: 7,
    name: 'Mustafa Aydın',
    email: 'mustafa@dipa.com.tr',
    role: 'merchandiser',
    status: 'active',
    region: 'İstanbul',
    company: 'DIPA'
  },
  {
    id: 8,
    name: 'Elif Yılmaz',
    email: 'elif@dipa.com.tr',
    role: 'merchandiser',
    status: 'active',
    region: 'Ankara',
    company: 'DIPA'
  }
];

const roles = [
  { value: 'admin', label: 'Yönetici' },
  { value: 'merchandiser', label: 'Merchandiser' },
  { value: 'supervisor', label: 'Supervisor' }
];

const regions = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'];
const companies = ['Gürsoy Fındık', 'Ülker', 'Eti', 'Torku', 'Nestle'];

const importTemplates = [
  { id: 'users', name: 'Kullanıcı Listesi' },
  { id: 'markets', name: 'Market Listesi' },
  { id: 'routes', name: 'Rut Planı' }
];

function Management() {
  const [users, setUsers] = useState(initialUsers);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [templateMenuAnchor, setTemplateMenuAnchor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleOpenTemplateMenu = (event) => {
    setTemplateMenuAnchor(event.currentTarget);
  };

  const handleCloseTemplateMenu = () => {
    setTemplateMenuAnchor(null);
  };

  const handleDownloadTemplate = (templateId) => {
    // Template indirme işlemi burada yapılacak
    setSnackbar({
      open: true,
      message: 'Şablon indiriliyor...',
      severity: 'info'
    });
    handleCloseTemplateMenu();
  };

  const handleImportFile = (event) => {
    // Dosya yükleme işlemi burada yapılacak
    setSnackbar({
      open: true,
      message: 'Dosya başarıyla yüklendi',
      severity: 'success'
    });
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setOpenDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setSnackbar({
      open: true,
      message: 'Kullanıcı silindi',
      severity: 'success'
    });
  };

  const handleSaveUser = (userData) => {
    if (selectedUser) {
      setUsers(users.map(user => user.id === selectedUser.id ? { ...user, ...userData } : user));
    } else {
      setUsers([...users, { id: Date.now(), ...userData }]);
    }
    setOpenDialog(false);
    setSnackbar({
      open: true,
      message: `Kullanıcı ${selectedUser ? 'güncellendi' : 'eklendi'}`,
      severity: 'success'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Rut Optimizasyonu Kartı */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              bgcolor: 'primary.main',
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <RouteIcon sx={{ fontSize: 40 }} />
            <Typography variant="h6">Rut Optimizasyonu</Typography>
            <Typography variant="body2" align="center">
              Rut optimizasyonu ile zaman ve maliyetten tasarruf edin.
            </Typography>
            <Button
              variant="contained"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Optimize Et
            </Button>
          </Paper>
        </Grid>

        {/* Excel İşlemleri Kartı */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              height: '100%',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h6">Excel İşlemleri</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={handleOpenTemplateMenu}
              >
                Şablon İndir
              </Button>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                component="label"
              >
                Excel Yükle
                <input
                  type="file"
                  hidden
                  accept=".xlsx,.xls"
                  onChange={handleImportFile}
                />
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Çalışan Listesi */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ad Soyad</TableCell>
                  <TableCell>E-posta</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Bölge</TableCell>
                  <TableCell>Durum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={roles.find(r => r.value === user.role)?.label}
                        size="small"
                        color={user.role === 'admin' ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{user.region}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.status === 'active' ? 'Aktif' : 'Pasif'}
                        size="small"
                        color={user.status === 'active' ? 'success' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Şablon İndirme Menüsü */}
      <Menu
        anchorEl={templateMenuAnchor}
        open={Boolean(templateMenuAnchor)}
        onClose={handleCloseTemplateMenu}
      >
        {importTemplates.map((template) => (
          <MenuItem
            key={template.id}
            onClick={() => handleDownloadTemplate(template.id)}
          >
            {template.name}
          </MenuItem>
        ))}
      </Menu>

      {/* Kullanıcı Ekleme/Düzenleme Dialog */}
      <UserDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Kullanıcı Dialog Bileşeni
function UserDialog({ open, onClose, onSave, user }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    region: '',
    company: '',
    status: 'active'
  });

  useState(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        name: '',
        email: '',
        role: '',
        region: '',
        company: '',
        status: 'active'
      });
    }
  }, [user]);

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {user ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Ad Soyad"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="E-posta"
            fullWidth
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <FormControl fullWidth>
            <InputLabel>Rol</InputLabel>
            <Select
              value={formData.role}
              label="Rol"
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Bölge</InputLabel>
            <Select
              value={formData.region}
              label="Bölge"
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            >
              {regions.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Firma</InputLabel>
            <Select
              value={formData.company}
              label="Firma"
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            >
              {companies.map((company) => (
                <MenuItem key={company} value={company}>
                  {company}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button onClick={handleSubmit} variant="contained">
          {user ? 'Güncelle' : 'Ekle'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Management; 