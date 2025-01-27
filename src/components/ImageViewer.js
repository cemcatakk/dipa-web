import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  MobileStepper,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const ImageViewer = ({ images, open, onClose, initialIndex = 0 }) => {
  const [activeStep, setActiveStep] = useState(initialIndex);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'white',
          bgcolor: 'rgba(0,0,0,0.5)',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <Box
          component="img"
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: '80vh',
            objectFit: 'contain',
          }}
          src={images[activeStep]}
          alt={`Görsel ${activeStep + 1}`}
        />
        <MobileStepper
          steps={images.length}
          position="static"
          activeStep={activeStep}
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            bgcolor: 'rgba(0,0,0,0.5)',
          }}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === images.length - 1}
              sx={{ color: 'white' }}
            >
              İleri
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ color: 'white' }}
            >
              <KeyboardArrowLeft />
              Geri
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer; 