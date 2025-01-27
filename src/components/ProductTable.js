import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Typography,
  Box
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';

const ProductTable = ({ type, data }) => {
  const getTableHeaders = () => {
    switch(type) {
      case 'warehouse':
        return ['Ürün Kodu', 'Ürün Adı', 'Stok Durumu', 'Depo Miktarı', 'Son Kontrol'];
      case 'shelf':
        return ['Ürün Kodu', 'Ürün Adı', 'Raf Durumu', 'SKT', 'Notlar'];
      case 'gursoy':
      case 'competitor':
        return ['Ürün Kodu', 'Ürün Adı', 'Bulunurluk', 'Fiyat', 'Stok'];
      default:
        return [];
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'var':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'yok':
        return <CancelIcon sx={{ color: 'error.main' }} />;
      case 'az':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              {getTableHeaders().map((header, index) => (
                <TableCell key={index} align={index === 0 ? 'left' : 'center'}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {header}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((value, cellIndex) => (
                  <TableCell key={cellIndex} align={cellIndex === 0 ? 'left' : 'center'}>
                    {cellIndex === 2 ? getStatusIcon(value) : value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductTable; 