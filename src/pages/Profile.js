import { Box, Paper, Avatar, Typography, Grid, Divider, Button, TextField } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';

const initialUserData = {
  name: "Nevra Sönmez",
  email: "nevra@dipa.com.tr",
  phone: "+90 532 123 45 67",
  company: "DIPA Merchandising",
  role: "Sorumlu Yönetici",
  location: "İstanbul, Türkiye",
  avatar: "https://i.pravatar.cc/150?img=45",
  startDate: "01.01.2023"
};

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  const [tempData, setTempData] = useState(initialUserData);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(userData);
  };

  const handleSave = () => {
    setUserData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData(userData);
  };

  const handleChange = (field) => (event) => {
    setTempData({
      ...tempData,
      [field]: event.target.value
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 500 }}>
            Kullanıcı Profili
          </Typography>
          <Divider sx={{ mt: 2 }} />
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box sx={{ 
              bgcolor: 'grey.50', 
              p: 3, 
              borderRadius: 2,
              textAlign: 'center'
            }}>
              <Avatar
                src={userData.avatar}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto',
                  mb: 2,
                  border: '3px solid white',
                  boxShadow: '0 0 0 2px #FF6B00'
                }}
              />
              <Typography variant="h6" sx={{ mb: 1 }}>
                {userData.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'primary.main',
                  bgcolor: 'primary.lighter',
                  py: 0.5,
                  px: 1,
                  borderRadius: 1,
                  display: 'inline-block'
                }}
              >
                {userData.role}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={9}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                Kişisel Bilgiler
              </Typography>
              {!isEditing && (
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  onClick={handleEdit}
                  size="small"
                >
                  Düzenle
                </Button>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Ad Soyad
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={tempData.name}
                      onChange={handleChange('name')}
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body1">{userData.name}</Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    E-posta
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={tempData.email}
                      onChange={handleChange('email')}
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body1">{userData.email}</Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Telefon
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={tempData.phone}
                      onChange={handleChange('phone')}
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body1">{userData.phone}</Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Şirket
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={tempData.company}
                      onChange={handleChange('company')}
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body1">{userData.company}</Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Lokasyon
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={tempData.location}
                      onChange={handleChange('location')}
                      variant="outlined"
                    />
                  ) : (
                    <Typography variant="body1">{userData.location}</Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Başlangıç Tarihi
                  </Typography>
                  <Typography variant="body1">{userData.startDate}</Typography>
                </Box>
              </Grid>
            </Grid>

            {isEditing && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  color="inherit"
                >
                  İptal
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                >
                  Kaydet
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Profile; 