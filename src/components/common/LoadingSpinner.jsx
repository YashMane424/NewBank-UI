import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = () => (
  <Box className="flex justify-center items-center min-h-screen">
    <CircularProgress size={60} />
  </Box>
);

export default LoadingSpinner;