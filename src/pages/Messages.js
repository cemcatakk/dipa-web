import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Avatar, 
  Tabs, 
  Tab, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Badge,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';

const dummyMerchandisers = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    status: 'online',
    lastMessage: 'Merhaba, nasılsınız?',
    lastMessageTime: '10:30',
    unread: 2
  },
  {
    id: 2,
    name: 'Ayşe Kaya',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    status: 'online',
    lastMessage: 'Merhaba, nasılsınız?',
    lastMessageTime: '10:30',
    unread: 2
  },
  {
    id: 3,
    name: 'Fatma Şahin',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    status: 'online',
    lastMessage: 'Merhaba, nasılsınız?',
    lastMessageTime: '10:30',
    unread: 2
  },
  {
    id: 5,
    name: 'Fatma Cesur',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    status: 'online',
    lastMessage: 'Merhaba, nasılsınız?',
    lastMessageTime: '10:30',
    unread: 2
  },
  // ... daha fazla merchandiser
];

const dummyGroups = [
  {
    id: 1,
    name: 'İstanbul Ekibi',
    avatar: null,
    members: 12,
    lastMessage: 'Yarınki toplantı hakkında...',
    lastMessageTime: '11:45',
    unread: 5
  },
  // ... daha fazla grup
];

const dummyMessages = [
  {
    id: 1,
    sender: 'Ben',
    message: 'Merhaba, bugünkü ziyaret planını gönderiyorum.',
    time: '09:30',
    isMe: true,
  },
  {
    id: 2,
    sender: 'Ben',
    message: 'Toplam 5 market ziyaret edilecek.',
    time: '09:30',
    isMe: true,
  },
  {
    id: 3,
    type: 'image',
    sender: 'Ben',
    message: 'ziyaret-plani.jpg',
    imageUrl: 'https://picsum.photos/400/300',
    time: '09:31',
    isMe: true,
  },
  {
    id: 4,
    sender: 'Ben',
    message: 'Akşam raporları da buradan paylaşacağım.',
    time: '09:32',
    isMe: true,
  },
];

function Messages() {
  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [openNewGroupModal, setOpenNewGroupModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    avatar: null,
    members: []
  });
  const [memberFilters, setMemberFilters] = useState({
    name: '',
    organization: ''
  });

  const organizations = [
    { id: 1, name: 'İstanbul Organizasyonu' },
    { id: 2, name: 'Ankara Organizasyonu' },
    { id: 3, name: 'İzmir Organizasyonu' },
  ];

  const filteredMerchandisers = dummyMerchandisers.filter(m => {
    const nameMatch = m.name.toLowerCase().includes(memberFilters.name.toLowerCase());
    const orgMatch = !memberFilters.organization || m.organization === memberFilters.organization;
    return nameMatch && orgMatch;
  });

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Mesaj gönderme işlemi
      setMessage('');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Dosya yükleme işlemi
    }
  };

  const handleNewGroup = () => {
    console.log('New group:', newGroup);
    setOpenNewGroupModal(false);
    setNewGroup({ name: '', avatar: null, members: [] });
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 88px)' }}>
      {/* Sol Panel - Merchandiser/Grup Listesi */}
      <Paper sx={{ 
        width: 320, 
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Mesajlar</Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Tabs 
          value={tab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: '1px solid #eee' }}
        >
          <Tab 
            icon={<PersonIcon />} 
            label="Temsilciler" 
            iconPosition="start"
          />
          <Tab 
            icon={<GroupIcon />} 
            label="Gruplar" 
            iconPosition="start"
          />
        </Tabs>

        {tab === 1 && (
          <Button
            startIcon={<AddIcon />}
            onClick={() => setOpenNewGroupModal(true)}
            sx={{ m: 2 }}
            variant="outlined"
          >
            Yeni Grup
          </Button>
        )}

        <List sx={{ 
          flex: 1, 
          overflow: 'auto',
          '& .MuiListItem-root': {
            borderBottom: '1px solid #f5f5f5',
          }
        }}>
          {(tab === 0 ? dummyMerchandisers : dummyGroups).map((item) => (
            <ListItem 
              key={item.id}
              button
              selected={selectedChat?.id === item.id}
              onClick={() => setSelectedChat(item)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 107, 0, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 0, 0.12)',
                  },
                },
              }}
            >
              <ListItemAvatar>
                <Badge
                  color="success"
                  variant="dot"
                  invisible={!item.status || item.status !== 'online'}
                >
                  <Avatar 
                    src={item.avatar}
                    sx={{ bgcolor: !item.avatar ? 'primary.main' : undefined }}
                  >
                    {!item.avatar && (tab === 0 ? <PersonIcon /> : <GroupIcon />)}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.lastMessageTime}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        maxWidth: '70%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.lastMessage}
                    </Typography>
                    {item.unread > 0 && (
                      <Chip
                        label={item.unread}
                        size="small"
                        color="primary"
                        sx={{ 
                          height: 20,
                          minWidth: 20,
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Sağ Panel - Chat */}
      <Box sx={{ 
        flex: 1, 
        ml: 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fff',
        borderRadius: '12px',
      }}>
        {selectedChat ? (
          <>
            {/* Chat Başlığı */}
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Avatar 
                src={selectedChat.avatar}
                sx={{ width: 40, height: 40 }}
              >
                {!selectedChat.avatar && (tab === 0 ? <PersonIcon /> : <GroupIcon />)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1">{selectedChat.name}</Typography>
                {tab === 1 && (
                  <Typography variant="caption" color="text.secondary">
                    {selectedChat.members} üye
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Mesajlar */}
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              overflow: 'auto',
              bgcolor: '#f8f9fa'
            }}>
              {dummyMessages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 2,
                  }}
                >
                  <Box sx={{
                    maxWidth: msg.type === 'image' ? '400px' : '70%',
                    bgcolor: 'primary.main',
                    color: '#fff',
                    p: 2,
                    borderRadius: 2,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}>
                    {msg.type === 'image' ? (
                      <>
                        <Box 
                          component="img" 
                          src={msg.imageUrl}
                          sx={{ 
                            width: '100%',
                            height: 'auto',
                            borderRadius: 1,
                            mb: 1,
                            cursor: 'pointer'
                          }}
                          onClick={() => window.open(msg.imageUrl, '_blank')}
                        />
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.875rem'
                        }}>
                          <ImageIcon sx={{ fontSize: 20 }} />
                          {msg.message}
                        </Box>
                      </>
                    ) : (
                      <Typography variant="body1">{msg.message}</Typography>
                    )}
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        textAlign: 'right',
                        mt: 0.5,
                        opacity: 0.7
                      }}
                    >
                      {msg.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Mesaj Gönderme */}
            <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
              <Box sx={{ 
                display: 'flex',
                gap: 1,
                alignItems: 'center'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  onChange={handleFileUpload}
                />
                <label htmlFor="image-upload">
                  <IconButton component="span" color="primary">
                    <ImageIcon />
                  </IconButton>
                </label>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Mesajınızı yazın..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <IconButton 
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary'
          }}>
            <Typography>Sohbet başlatmak için bir kişi veya grup seçin</Typography>
          </Box>
        )}
      </Box>

      {/* Yeni Grup Modal */}
      <Dialog 
        open={openNewGroupModal} 
        onClose={() => setOpenNewGroupModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Yeni Grup Oluştur
          <IconButton
            onClick={() => setOpenNewGroupModal(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Grup Adı"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{ width: 56, height: 56 }}
                src={newGroup.avatar ? URL.createObjectURL(newGroup.avatar) : null}
              >
                {!newGroup.avatar && <GroupIcon sx={{ fontSize: 28 }} />}
              </Avatar>
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
                  onChange={(e) => setNewGroup({ 
                    ...newGroup, 
                    avatar: e.target.files[0] 
                  })}
                />
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              size="small"
              placeholder="İsme göre ara..."
              value={memberFilters.name}
              onChange={(e) => setMemberFilters({ ...memberFilters, name: e.target.value })}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Organizasyon</InputLabel>
              <Select
                value={memberFilters.organization}
                label="Organizasyon"
                onChange={(e) => setMemberFilters({ ...memberFilters, organization: e.target.value })}
              >
                <MenuItem value="">Tümü</MenuItem>
                {organizations.map(org => (
                  <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            height: 400
          }}>
            {/* Üye Listesi */}
            <Paper sx={{ 
              flex: 2,
              overflow: 'auto',
              borderRadius: 1,
              border: '1px solid #e0e0e0'
            }}>
              <List dense>
                {filteredMerchandisers.map((merchandiser) => (
                  <ListItem
                    key={merchandiser.id}
                    secondaryAction={
                      <Chip
                        label={newGroup.members.includes(merchandiser.id) ? 'Seçildi' : 'Seç'}
                        color={newGroup.members.includes(merchandiser.id) ? 'primary' : 'default'}
                        size="small"
                        onClick={() => {
                          setNewGroup(prev => ({
                            ...prev,
                            members: prev.members.includes(merchandiser.id)
                              ? prev.members.filter(id => id !== merchandiser.id)
                              : [...prev.members, merchandiser.id]
                          }));
                        }}
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={merchandiser.avatar}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={merchandiser.name}
                      secondary={organizations.find(o => o.id === merchandiser.organization)?.name}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Seçilen Üyeler */}
            <Paper sx={{ 
              flex: 1,
              overflow: 'auto',
              borderRadius: 1,
              border: '1px solid #e0e0e0',
              bgcolor: '#f8f9fa'
            }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Seçilen Üyeler ({newGroup.members.length})
                </Typography>
              </Box>
              <List dense>
                {newGroup.members.map((memberId) => {
                  const member = dummyMerchandisers.find(m => m.id === memberId);
                  return (
                    <ListItem
                      key={memberId}
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          size="small"
                          onClick={() => {
                            setNewGroup(prev => ({
                              ...prev,
                              members: prev.members.filter(id => id !== memberId)
                            }));
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar src={member?.avatar} sx={{ width: 32, height: 32 }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={member?.name}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewGroupModal(false)}>İptal</Button>
          <Button 
            onClick={handleNewGroup}
            variant="contained"
            disabled={!newGroup.name || newGroup.members.length === 0}
          >
            Grubu Oluştur
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Messages; 