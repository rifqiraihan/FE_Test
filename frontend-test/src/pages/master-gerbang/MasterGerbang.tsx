import { Add, Search } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { InputAdornment, TextField } from '@mui/material'
import { enqueueSnackbar } from 'notistack';
import React from 'react'
import { createGerbang, deleteGerbang, editGerbang, getAllGerbangs } from '../../api/gerbangApi';
import { IGerbang, IGerbangApiResponse } from '../../interfaces/gerbang';
import DataGridChild from './components/datagrid/Datagrid';
import Form from './components/form/Form';

const MasterData = () => {

  const [data, setData] = React.useState<IGerbang[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedData, setSelectedData] = React.useState<IGerbang | null>(null);
  const [open, setOpen] = React.useState(false);
  const [formType, setFormType] = React.useState<string>('');
  const [search, setSearch] = React.useState<string>('');
  const [filteredData, setFilteredData] = React.useState<IGerbang[]>([]);

  const handleFilter = React.useCallback(() => {
    const filtered = data.filter(
      (item) =>
        item.id.toString().toLowerCase().includes(search.toLowerCase()) ||
        item.IdCabang.toString().toLowerCase().includes(search.toLowerCase()) ||
        item.NamaGerbang.toLowerCase().includes(search.toLowerCase()) ||
        item.NamaCabang.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, search]);

  const handleAdd = () => {
    setFormType('Add New')
    setOpen(true);
  };

  const handleEdit = (value: IGerbang) => {
    setSelectedData(value);
    setFormType('Edit')
    setOpen(true);
  };

  const handleDelete = (value: IGerbang) => {
    setSelectedData(value);
    setFormType('Delete')
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedData(null);
    setFormType('')
  };

  const fetchGerbangs = async () => {
    try {
      const data: IGerbangApiResponse = await getAllGerbangs();
      setData(data.data.rows.rows); 
      setFilteredData(data.data.rows.rows); 
    } catch (err) {
      enqueueSnackbar('Failed to Fetch Gerbangs', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (value: IGerbang) => {
    console.log(value)
    setLoading(true);
    try {
      
      let response

      if (formType === 'Add New'){
         response = await createGerbang(value);
      } else if (formType === 'Edit'){
        response = await editGerbang(value);
      } else {
        response = await deleteGerbang(value);
      }
  
      if (response.status === true) {
        setLoading(false);
        enqueueSnackbar(response.message, { variant: 'success' });
        handleClose();
        fetchGerbangs();
      } else {
        setLoading(false);
        console.error('Unexpected response format:', response);
        enqueueSnackbar(response.message, { variant: 'error' });
      }
    } catch (error) {
      console.error('Error saving Gerbang data:', error);
      setLoading(false);
    }
  };
  

  React.useEffect(() => {
    fetchGerbangs();
    
  }, []);

  React.useEffect(() => {
    handleFilter();
  }, [search, handleFilter]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-10">Master Gerbang</h1>
      <div className='flex flex-col md:flex-row justify-between items-end md:items-center mb-4'>
          <TextField
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full md:w-1/3 !mb-2 !md:!mb-0'
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search fontSize='medium' />
                    </InputAdornment>
                  ),
                }}
              />
              <LoadingButton 
                loading={loading} 
                onClick={handleAdd}
                className='!py-3 !rounded-full !text-white'
                style={{backgroundColor:'rgb(25, 118, 210)', minWidth:'120px'}}
                startIcon={<Add />} 
              >
                Tambah
              </LoadingButton>
        </div>
   <DataGridChild
      data={filteredData}
      loading={loading}
      onEdit={handleEdit}
      onDelete={handleDelete}
   />
    <Form 
      open={open}
      defaultValue={selectedData}
      onClose={handleClose}
      onConfirm={onSave} 
      loading={loading}
      formType={formType}
    />
  </div>
  )
}

export default MasterData
