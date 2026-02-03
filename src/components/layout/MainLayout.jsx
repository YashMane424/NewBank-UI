import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../common/NavBar';

const MainLayout = () => {
  return (
    <Box className="min-h-screen bg-gray-50">
      <Navbar />
      <Box className="pt-20">
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;