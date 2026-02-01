import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from '@mui/material';
import { MdAccountBalance, MdPerson, MdLogout, MdSettings } from 'react-icons/md';
import { logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <AppBar position="fixed" className="bg-gradient-to-r from-blue-600 to-purple-600">
      <Toolbar>
        <MdAccountBalance className="text-3xl mr-2" />
        <Typography variant="h6" className="flex-grow font-heading">
          Banking App
        </Typography>
        
        <Box className="flex items-center gap-2">
          <Typography variant="body2" className="mr-2 hidden md:block">
            {user?.fullName || user?.username}
          </Typography>
          <IconButton onClick={handleMenu} color="inherit">
            <Avatar className="bg-white text-blue-600">
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <MdPerson className="mr-2" /> Profile
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <MdSettings className="mr-2" /> Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <MdLogout className="mr-2" /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;