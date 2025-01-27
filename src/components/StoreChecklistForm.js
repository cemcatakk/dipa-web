import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControlLabel,
  Checkbox,
  ImageList,
  ImageListItem,
  IconButton,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ImageViewer from './ImageViewer';
import { useState } from 'react';

const StoreChecklistForm = ({ type, data }) => {
  const [selectedImages, setSelectedImages] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const getAnswerIcon = (answer) => {
    if (answer === true) return <CheckCircleIcon color="success" />;
    if (answer === false) return <CancelIcon color="error" />;
    return null;
  };

  const handleImageClick = (images, index) => {
    setSelectedImages(images);
    setSelectedImageIndex(index);
  };

  const renderImages = (images) => {
    if (!images?.length) return null;

    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {images.map((img, index) => (
          <Box
            key={index}
            sx={{
              width: 120,
              height: 120,
              position: 'relative',
              cursor: 'pointer',
              '&:hover': {
                '& .MuiBox-root': { opacity: 1 },
              },
            }}
            onClick={() => handleImageClick(images, index)}
          >
            <img
              src={img}
              alt={`Görsel ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 8,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                p: 0.5,
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: '0 8px 0 8px',
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
            >
              <ZoomInIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box>
      {data.map((item, index) => (
        <Paper
          key={index}
          variant="outlined"
          sx={{ p: 2, mb: 2, '&:last-child': { mb: 0 } }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {item.question}
                </Typography>
                {item.required && (
                  <Chip
                    label="Zorunlu"
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {typeof item.answer === 'boolean' ? (
                  getAnswerIcon(item.answer)
                ) : (
                  <Typography>{item.answer}</Typography>
                )}
              </Box>
              {item.note && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Not: {item.note}
                </Typography>
              )}
            </Grid>
            {item.images && (
              <Grid item xs={12}>
                {renderImages(item.images)}
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}
      <ImageViewer
        images={selectedImages || []}
        open={Boolean(selectedImages)}
        onClose={() => setSelectedImages(null)}
        initialIndex={selectedImageIndex}
      />
    </Box>
  );
};

export default StoreChecklistForm; 