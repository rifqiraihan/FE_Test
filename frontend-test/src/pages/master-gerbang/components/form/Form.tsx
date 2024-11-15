// src/components/GerbangForm.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography, FormControl } from '@mui/material';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { IGerbangFormProps } from './interfaces';
import { IGerbang } from '../../../../interfaces/gerbang';
import { LoadingButton } from '@mui/lab';
import './Form.css'

const validationSchema = Yup.object({
  id: Yup.number()
  .required('Id is required')
  .typeError('Id is required')
  .transform((value) => (value === '' ? 0 : value)), 
  IdCabang: Yup.number()
  .required('Id Cabang is required')
  .typeError('Id Cabang is required')
  .transform((value) => (value === '' ? 0 : value)), 
  NamaGerbang: Yup.string().required('Nama Gerbang is required'),
  NamaCabang: Yup.string().required('Nama Cabang is required'),
});

const Form: React.FC<IGerbangFormProps> = ({ defaultValue, onClose, onConfirm, open, loading = false, formType }) => {

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (values: IGerbang) => {
    const postData: IGerbang = {
      ...values,
    };
    onConfirm(postData);
  };

  useEffect(() => {

    if (defaultValue) {
      setValue('id', defaultValue.id);
      setValue('IdCabang', defaultValue.IdCabang);
      setValue('NamaGerbang', defaultValue.NamaGerbang);
      setValue('NamaCabang', defaultValue.NamaCabang);
    }
  }, [defaultValue, setValue]);

  return (
    <Dialog 
    open={open} 
    onClose={onClose}
    sx={{
        '& .MuiDialog-paper': {
          borderRadius: '15px',
        },
      }}
    >
      <DialogTitle>
          <div className='flex justify-center items-center font-bold'>
            {formType} Gerbang
          </div>
      </DialogTitle>
      <Divider className='my-6'/>
      <DialogContent>
        {formType === 'Delete' ? (
          <div className='flex justify-center items-center' style={{minHeight:'100px'}}>
          Are you sure want to delete 
          <b className='mx-2'>{defaultValue?.NamaGerbang} - {defaultValue?.NamaCabang}</b> ?
        </div>
        ):(
        <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth margin='dense'>
            <div className='flex flex-row gap-1 items-center mb-1'>
                <Typography className="!font-bold !text-black">Id</Typography>
                <Typography className="!font-bold !text-red-500">*</Typography>
            </div>
            <TextField
                placeholder='Type here'
                fullWidth
                type="number"
                {...register('id')}
                error={!!errors.id}
                helperText={errors.id?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
            />
          </FormControl>
          <FormControl fullWidth margin='dense'>
            <div className='flex flex-row gap-1 items-center mb-1'>
                <Typography className="!font-bold !text-black">Id Cabang</Typography>
                <Typography className="!font-bold !text-red-500">*</Typography>
            </div>
            <TextField
                placeholder='Type here'
                fullWidth
                type="number"
                {...register('IdCabang')}
                error={!!errors.IdCabang}
                helperText={errors.IdCabang?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
            />
          </FormControl>
          <FormControl fullWidth margin='dense'>
            <div className='flex flex-row gap-1 items-center mb-1'>
                <Typography className="!font-bold !text-black">Nama Gerbang</Typography>
                <Typography className="!font-bold !text-red-500">*</Typography>
            </div>
            <TextField
                placeholder='Type here'
                fullWidth
                {...register('NamaGerbang')}
                error={!!errors.NamaGerbang}
                helperText={errors.NamaGerbang?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
            />
          </FormControl>
          <FormControl fullWidth margin='dense'>
            <div className='flex flex-row gap-1 items-center mb-1'>
                <Typography className="!font-bold !text-black">Nama Cabang</Typography>
                <Typography className="!font-bold !text-red-500">*</Typography>
            </div>
            <TextField
                fullWidth
                placeholder='Type here'
                {...register('NamaCabang')}
                error={!!errors.NamaCabang}
                helperText={errors.NamaCabang?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
            />
          </FormControl>
        </form>
        )}
      </DialogContent>
      <Divider className='my-6'/>
      <DialogActions className='m-4'>
        <LoadingButton 
            loading={loading} 
            onClick={onClose} 
            variant="outlined"
            className='!rounded-full !py-3 !text-black !border-gray-500'
            style={{ minWidth:'120px'}}
        >
          {formType === 'Delete' ? 'No' : 'Cancel'}
        </LoadingButton>
        <LoadingButton 
            loading={loading} 
            onClick={handleSubmit(onSubmit)} 
            variant="contained"
            disabled={loading}
            className='!rounded-full !py-3'
            style={formType === 'Delete' ? {backgroundColor:'#FF2929', minWidth:'120px'} : {backgroundColor:'rgb(25, 118, 210)', minWidth:'120px'}}
        >
           {formType === 'Delete' ? 'Yes' : 'Submit'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default Form;
