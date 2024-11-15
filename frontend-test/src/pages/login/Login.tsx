import { Backdrop, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const response = await login({ username, password });
        
        console.log(response)
        
        if (response.status === true) {
          localStorage.setItem('token', response.token);

          enqueueSnackbar(response.message, { variant: 'success' });

          setOpenBackdrop(true);

            setTimeout(() => {
                navigate('/');
            }, 2000); 

        } else {
          setError(response.message || 'Login failed. Please try again.');
          enqueueSnackbar(response.message, { variant: 'error' });
        }
      } catch (error) {
        setError('Login failed. Please try again.');
        enqueueSnackbar('Login failed. Please try again.', { variant: 'error' });
        console.error('Error during login:', error);
      }
  };

  return (
<div className="flex h-screen">
      {/* Left side: Login form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-8">
        <div className="mb-8">
            <img src={require('../../assets/img/jasamarga-logo.png')} alt="App Logo" className="h-24 w-auto mr-2" />
        </div>
        <form onSubmit={handleSubmit} className="w-full md:w-1/2">
            <div className="mb-4">
            <Typography className="!font-bold !text-black mb-1">Username</Typography>
            <TextField
                placeholder='Type username here'
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value)
                    setError('')
                }}
                fullWidth
                variant="outlined"
                required
                error={!!error}
                sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
            />
            </div>

            <div className="mb-4">
            <Typography className="!font-bold !text-black mb-1">Password</Typography>
            <TextField
                placeholder='******'
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                }}
                fullWidth
                sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                required
                error={!!error}
            />
            </div>
            {error && <p className="text-red-500 ml-2 mb-2">{error}</p>}
            <Button
            type="submit"
            fullWidth
            variant="contained"
            className="!p-3 !rounded-full hover:bg-blue-700"
            style={{backgroundColor:'rgb(25, 118, 210)'}}
            >
                Login
            </Button>
        </form>
      </div>

      <div 
      className="w-1/2  items-center justify-center relative hidden md:flex"
      >
         <img 
            src={require('../../assets/img/bg-jasamarga.png')} 
            alt="Jasa Marga" 
            className='w-full h-full object-cover'
          />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-25"></div>
      </div>

      <Backdrop
        open={openBackdrop}
        style={{ zIndex: 1200 }}
      >
        <CircularProgress color="primary" />
      </Backdrop>
      
    </div>

  );
};

export default Login;
