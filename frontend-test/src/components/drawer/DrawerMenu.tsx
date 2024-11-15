import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Collapse, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

const DrawerMenu: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [openLaporan, setOpenLaporan] = useState(false);

  const handleLaporanClick = () => {
    setOpenLaporan(!openLaporan);
  };

  return (
    <Drawer 
      open={open} 
      onClose={onClose} 
      variant="persistent" 
      sx={{
        width: 300, // Drawer width
        flexShrink: 0, // Prevent shrinking
        '& .MuiDrawer-paper': {
          width: 300, // Apply width to the paper component
          boxSizing: 'border-box', // Ensure the box model is correct
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)', // Shadow similar to shadow-xl in Tailwind
          borderTopRightRadius: '12px', // Top-right border radius
          borderBottomRightRadius: '12px', // Bottom-right border radius
        },
      }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <img src={require('../../assets/img/jasamarga-logo.png')} alt="App Logo" className="h-12 w-auto mr-2" />
        </div>
        <IconButton onClick={onClose}>
          <ArrowBackIcon />
        </IconButton>
      </div>

      <Divider />

      <List className="w-full">
        <ListItem button component={Link as React.ElementType} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <Divider />

        <ListItem component="div" onClick={handleLaporanClick} className='cursor-pointer'>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Laporan Lalin" />
          {openLaporan ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={openLaporan} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="!pl-16 cursor-pointer">
            <ListItem button component={Link as React.ElementType} to="/laporan/per-hari">
              <ListItemText primary="Laporan Per Hari" />
            </ListItem>
          </List>
        </Collapse>
        <Divider />

        <ListItem button component={Link as React.ElementType} to="/master-gerbang">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Master Gerbang" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default DrawerMenu;
