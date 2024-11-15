import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, Backdrop, CircularProgress, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, AccountCircleOutlined, PersonOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

interface IHeaderProps {
    onOpenDrawer: () => void;
  }

const Header = ( {onOpenDrawer} :IHeaderProps) => {
  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);


  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setOpenBackdrop(true);
    localStorage.removeItem('token');
    enqueueSnackbar("Logged out Successful!", { variant: 'success' });

    setTimeout(() => {
      
      navigate('/login');

      setOpenDialog(false);
      setOpenBackdrop(false);
    }, 2000);
  };

  return (
    <>
      <AppBar position="relative" color='transparent' >
        <Toolbar className='flex flex-row justify-between items-center my-3'>
          <div className='flex flex-row items-center gap-6'>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={onOpenDrawer}>
              <MenuIcon />
            </IconButton>
            <img src={require('../../assets/img/jasamarga-logo.png')} alt="App Logo" className="h-16 w-auto mr-2 hidden md:flex" />
          </div>

          <IconButton color="inherit" onClick={handleProfileClick}>
            <AccountCircleOutlined fontSize='large' />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top', 
              horizontal: 'center',
            }}
          >
            <MenuItem onClick={()=>setOpenDialog(true)}>Logout</MenuItem>
          </Menu>

          <Dialog 
            open={openDialog} 
            onClose={()=>setOpenDialog(false)}
            sx={{
              '& .MuiDialog-paper': {
                borderRadius: '15px',
              },
            }}
          >
              <DialogTitle>
                <div className='flex justify-center items-center font-bold'>
                  Logout Confirmation
                </div>
            </DialogTitle>

            <Divider className='my-6'/>
            
            <DialogContent>
              <div className='items-center my-4'>
                Are you sure you want to logout?
              </div>
            </DialogContent>
            <Divider className='my-6'/>
            <DialogActions className='m-4'>
              <Button 
                onClick={()=>setOpenDialog(false)} 
                variant="outlined"
                className='!rounded-full !py-3 !text-black !border-gray-500'
                style={{ minWidth:'120px'}}
               >
                No
              </Button>
              <Button 
                onClick={handleLogout} 
                variant="contained"
                className='!rounded-full !py-3'
                style={{backgroundColor:'rgb(25, 118, 210)', minWidth:'120px'}}
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>

          <Backdrop open={openBackdrop} style={{ zIndex: 9999 }}>
            <CircularProgress color="primary" />
          </Backdrop>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
