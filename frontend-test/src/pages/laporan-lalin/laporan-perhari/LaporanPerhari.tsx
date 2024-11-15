import { FileDownload, FilterAlt, KeyboardArrowDown, Search } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, TextField, Tooltip, } from '@mui/material'
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react'
import { getLalins } from '../../../api/lalinApi';
import { ILalin } from '../../../interfaces/lalin';
import { LoadingButton } from '@mui/lab';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import './LaporanPerhari.css'

interface TotalRow {
  ruas: string;
  golI: number;
  golII: number;
  golIII: number;
  golIV: number;
  golV: number;
  totalLalin: number;
}

const LaporanPerhari = () => {

  const [data, setData] = useState<ILalin[]>([]);
  const [filteredData, setFilteredData] = useState<ILalin[]>([]);
  const [search, setSearch] = useState<string>('');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [date, setDate] = useState<Moment | null>(moment('2023-11-01'));
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<string>('Keseluruhan');


  const apiRef = useGridApiRef();


  const fetchLalins = React.useCallback(async () => {
    try {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      const response = await getLalins(formattedDate);
      setData(response.data.rows.rows);
      setFilteredData(response.data.rows.rows);
    } catch (err) {
      enqueueSnackbar('Failed to Fetch Lalins', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [date]);

const handleFilter = () => {
  const filteredData = data.filter((item) => {
      const searchTerm = search.toLowerCase();
      const itemDate = moment(item.Tanggal);
      const matchesSearch = searchTerm === '' || 
          item.id.toString().includes(searchTerm) ||
          item.IdCabang.toString().includes(searchTerm) ||
          item.IdGerbang.toString().includes(searchTerm) ||
          item.Tanggal.toLowerCase().includes(searchTerm) ||
          item.Shift.toString().includes(searchTerm) ||
          item.IdGardu.toString().includes(searchTerm) ||
          item.Golongan.toString().includes(searchTerm) ||
          item.IdAsalGerbang.toString().includes(searchTerm)
      const matchesDate = !date || itemDate.isSame(date, 'day');
      return matchesSearch && matchesDate;
  });
  setFilteredData(filteredData);
  fetchLalins()
};

  const handleReset = () => {
    setSearch('');
    setDate(moment());
    setFilteredData(data);
  };

  const handleFilterByPayment = (paymentMethod: string) => {
    let filteredDataPayment: ILalin[] = [];
    if (paymentMethod === 'KTP') {
      filteredDataPayment = data.filter(item => item.DinasOpr > 0 || item.DinasMitra > 0 || item.DinasKary > 0);
    } else if (paymentMethod === 'E-Toll') {
      filteredDataPayment = data.filter(item => item.eMandiri > 0 || item.eBri > 0 || item.eBni > 0 || item.eBca > 0 || item.eNobu > 0 || item.eDKI > 0 || item.eMega > 0);
    } else if (paymentMethod === 'Flo') {
      filteredDataPayment = data.filter(item => item.eFlo > 0);
    } else if (paymentMethod === 'E-Toll+Tunai+Flo') {
      filteredDataPayment = data.filter(item => item.Tunai > 0 || item.eMandiri > 0 || item.eBri > 0 || item.eBni > 0 || item.eBca > 0 || item.eNobu > 0 || item.eDKI > 0 || item.eMega > 0 || item.eFlo > 0);
    } else if (paymentMethod === 'Keseluruhan') {
      filteredDataPayment = data;
    } else {
      filteredDataPayment = data.filter(item => item.Tunai > 0);
    }
    setCurrentPaymentMethod(paymentMethod);
    setFilteredData(filteredDataPayment);
  };

  const getPaymentMethod = (item: ILalin): string => {
    console.log(item)
    if (item.DinasOpr > 0 || item.DinasMitra > 0 || item.DinasKary > 0) {
      return 'KTP';
    } else if (item.eMandiri > 0 || item.eBri > 0 || item.eBni > 0 || item.eBca > 0 || item.eNobu > 0 || item.eDKI > 0 || item.eMega > 0) {
      return 'E-Toll';
    } else if (item.eMandiri > 0 || item.eBri > 0 || item.eBni > 0 || item.eBca > 0 || item.eNobu > 0 || item.eDKI > 0 || item.eMega > 0 || item.Tunai > 0 || item.eFlo > 0) {
      return 'E-Toll+Tunai+Flo';
    } else if (item.eFlo > 0) {
      return 'Flo';
    } else if (item.Tunai > 0) {
      return 'Tunai';
    } else {
      return 'Keseluruhan';
    }
  };

  const calculateLalin = (item: ILalin, golongan: number, paymentMethod: string): number => {
    switch (paymentMethod) {
      case 'KTP':
        return item.DinasOpr + item.DinasMitra + item.DinasKary;
      case 'E-Toll':
        return item.eMandiri + item.eBri + item.eBni + item.eBca + item.eNobu + item.eDKI + item.eMega;
      case 'Flo':
        return item.eFlo;
      case 'Tunai':
        return item.Tunai;
      case 'E-Toll+Tunai+Flo':
        return item.Tunai + item.eMandiri + item.eBri + item.eBni + item.eBca + item.eNobu + item.eDKI + item.eMega + item.eFlo;
      default:
        return item.Tunai + item.DinasOpr + item.DinasMitra + item.DinasKary + item.eMandiri + item.eBri + item.eBni + item.eBca + item.eNobu + item.eDKI + item.eMega + item.eFlo;
    }
  };

  const handleExport = () => {
    if (apiRef.current) {
        apiRef.current.exportDataAsCsv();
      }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'No.', minWidth: 90, flex:1 },
    { field: 'ruas', headerName: 'Ruas', minWidth: 150, flex:1 },
    { field: 'gerbang', headerName: 'Gerbang', minWidth: 150, flex:1 },
    { field: 'gardu', headerName: 'Gardu', minWidth: 110, flex:1 },
    { field: 'hari', headerName: 'Hari', minWidth: 110, flex:1 },
    { field: 'tanggal', headerName: 'Tanggal', minWidth: 150, flex:1 },
    { field: 'metodePembayaran', headerName: 'Metode Pembayaran', minWidth: 250, flex:1 },
    { field: 'golI', headerName: 'Gol I', minWidth: 110, flex:1 },
    { field: 'golII', headerName: 'Gol II', minWidth: 110, flex:1 },
    { field: 'golIII', headerName: 'Gol III', minWidth: 110, flex:1 },
    { field: 'golIV', headerName: 'Gol IV', minWidth: 110, flex:1 },
    { field: 'golV', headerName: 'Gol V', minWidth: 110, flex:1 },
    { field: 'totalLalin', headerName: 'Total Lalin', minWidth: 150, flex:1 },
  ];


const transformedData = filteredData.map((item, index) => {
  const paymentMethod = currentPaymentMethod === 'Keseluruhan' ? getPaymentMethod(item) : currentPaymentMethod;
  return {
    id: index + 1,
    ruas: `Ruas ${item.IdCabang}`,
    gerbang: `Gerbang ${item.IdGerbang}`,
    gardu: item.IdGardu.toString().padStart(2, '0'),
    hari: new Date(item.Tanggal).toLocaleDateString('id-ID', { weekday: 'long' }),
    tanggal: new Date(item.Tanggal).toLocaleDateString('id-ID'),
    metodePembayaran: currentPaymentMethod,
    golI: calculateLalin(item, 1, paymentMethod),
    golII: calculateLalin(item, 2, paymentMethod),
    golIII: calculateLalin(item, 3, paymentMethod),
    golIV: calculateLalin(item, 4, paymentMethod),
    golV: calculateLalin(item, 5, paymentMethod),
    totalLalin: calculateLalin(item, 1, paymentMethod) + calculateLalin(item, 2, paymentMethod) + calculateLalin(item, 3, paymentMethod) + calculateLalin(item, 4, paymentMethod) + calculateLalin(item, 5, paymentMethod),
  };
});

 const groupedData = transformedData.reduce((acc: Record<string, TotalRow>, item) => {
  if (!acc[item.ruas]) {
    acc[item.ruas] = {
      ruas: item.ruas,
      golI: 0,
      golII: 0,
      golIII: 0,
      golIV: 0,
      golV: 0,
      totalLalin: 0,
    };
  }
  acc[item.ruas].golI += item.golI;
  acc[item.ruas].golII += item.golII;
  acc[item.ruas].golIII += item.golIII;
  acc[item.ruas].golIV += item.golIV;
  acc[item.ruas].golV += item.golV;
  acc[item.ruas].totalLalin += item.totalLalin;
  return acc;
}, {});

  const totalRows = Object.values(groupedData);
  const totalLalinRuasKeseluruhan = totalRows.reduce((sum, row) => sum + row.totalLalin, 0);

  const totalGolI = totalRows.reduce((sum, row) => sum + row.golI, 0);
  const totalGolII = totalRows.reduce((sum, row) => sum + row.golII, 0);
  const totalGolIII = totalRows.reduce((sum, row) => sum + row.golIII, 0);
  const totalGolIV = totalRows.reduce((sum, row) => sum + row.golIV, 0);
  const totalGolV = totalRows.reduce((sum, row) => sum + row.golV, 0);

  

React.useEffect(() => {
  fetchLalins();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  
  return (
      <div>
        <h1 className="text-2xl font-bold mb-10">Laporan Lalin Per Hari</h1>
        {showFilter ? (
        <div className="mb-10 border-2 shadow-xl p-6" style={{borderRadius:'12px'}}>
          <div className='flex flex-row justify-between items-center mb-2'>
            <div/>  
            <Tooltip title='Hide Filter'>
            <IconButton onClick={()=>setShowFilter(false)}>
              <KeyboardArrowDown/>
            </IconButton>
            </Tooltip>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-4 w-full md:w-1/2">
          <TextField
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full !mb-2 !md:!mb-0'
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
            <div className="w-full">
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DesktopDatePicker
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="flex space-x-4">
            <LoadingButton 
              loading={loading}
               variant="contained"
               className="!p-3 !rounded-full hover:!bg-blue-500"
               style={{backgroundColor:'rgb(25, 118, 210)', minWidth:'120px'}}
              onClick={handleFilter}>
              Filter
            </LoadingButton>
            <LoadingButton
              loading={loading} 
               variant="outlined"
               className='!rounded-full !py-3 !text-black !border-gray-500'
               style={{ minWidth:'120px'}}
              onClick={handleReset}
            >
              Reset
            </LoadingButton>
          </div>
        </div>
        ):(
            <Button 
               variant="outlined"
               className='!rounded-full !py-3 !text-black !border-gray-500 !mb-6'
               style={{ minWidth:'120px'}}
              onClick={()=>setShowFilter(true)}
              startIcon={
                <FilterAlt/>
              }
            >
              Show Filter
            </Button>
        )}
         
        <div className="my-6">
          {filteredData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', justifyItems: 'end', marginTop: '20px',  marginBottom: '20px' }}>
            <LoadingButton
              loading={loading} 
              variant="contained"
              className="!p-3 !rounded-full hover:!bg-blue-500"
              style={{backgroundColor:'rgb(25, 118, 210)', minWidth:'120px'}}
              onClick={handleExport} 
              startIcon={<FileDownload />}
            >
              Export
            </LoadingButton>
          </div>
          )}

        {data.length > 0 && (
          <div className="flex flex-row gap-4 overflow-x-auto border-2 rounded-full p-2 max-w-fit">
          <Button
            style={{
              borderRadius: '9999px',
              color: currentPaymentMethod === 'Tunai' ? 'white' : 'black',
              backgroundColor: currentPaymentMethod === 'Tunai' ? '#3b82f6' : 'transparent',
              padding: '12px',
              minWidth: '150px',
              borderWidth: currentPaymentMethod === 'Tunai' ? '0px' : '2px',
              border:'2px solid grey',
              borderColor: 'black',
            }}
            onClick={() => handleFilterByPayment('Tunai')}
          >
            Total Tunai
          </Button>

          <Button
            style={{
              borderRadius: '9999px',
              color: currentPaymentMethod === 'E-Toll' ? 'white' : 'black',
              backgroundColor: currentPaymentMethod === 'E-Toll' ? '#3b82f6' : 'transparent',
              padding: '12px',
              minWidth: '150px',
              borderWidth: currentPaymentMethod === 'E-Toll' ? '0px' : '2px',
              borderColor: 'black',
              border:'2px solid grey',
            }}
            onClick={() => handleFilterByPayment('E-Toll')}
          >
            Total E-Toll
          </Button>

          <Button
            style={{
              borderRadius: '9999px',
              color: currentPaymentMethod === 'Flo' ? 'white' : 'black',
              backgroundColor: currentPaymentMethod === 'Flo' ? '#3b82f6' : 'transparent',
              padding: '12px',
              minWidth: '150px',
              borderWidth: currentPaymentMethod === 'Flo' ? '0px' : '2px',
              borderColor: 'black',
              border:'2px solid grey',
            }}
            onClick={() => handleFilterByPayment('Flo')}
          >
            Total Flo
          </Button>

          <Button
            style={{
              borderRadius: '9999px',
              color: currentPaymentMethod === 'KTP' ? 'white' : 'black',
              backgroundColor: currentPaymentMethod === 'KTP' ? '#3b82f6' : 'transparent',
              padding: '12px',
              minWidth: '150px',
              borderWidth: currentPaymentMethod === 'KTP' ? '0px' : '2px',
              borderColor: 'black',
              border:'2px solid grey',
            }}
            onClick={() => handleFilterByPayment('KTP')}
          >
            Total KTP
          </Button>

          <Button
            style={{
              borderRadius: '9999px',
              color: currentPaymentMethod === 'Keseluruhan' ? 'white' : 'black',
              backgroundColor: currentPaymentMethod === 'Keseluruhan' ? '#3b82f6' : 'transparent',
              padding: '12px',
              minWidth: '150px',
              borderWidth: currentPaymentMethod === 'Keseluruhan' ? '0px' : '2px',
              borderColor: 'black',
              border:'2px solid grey',
            }}
            onClick={() => handleFilterByPayment('Keseluruhan')}
          >
            Total Keseluruhan
          </Button>

          <Button
            style={{
              borderRadius: '9999px',
              color: currentPaymentMethod === 'E-Toll+Tunai+Flo' ? 'white' : 'black',
              backgroundColor: currentPaymentMethod === 'E-Toll+Tunai+Flo' ? '#3b82f6' : 'transparent',
              padding: '12px',
              minWidth: '150px',
              borderWidth: currentPaymentMethod === 'E-Toll+Tunai+Flo' ? '0px' : '2px',
              borderColor: 'black',
              border:'2px solid grey',
            }}
            onClick={() => handleFilterByPayment('E-Toll+Tunai+Flo')}
          >
            Total E-Toll+Tunai+Flo
          </Button>

           
          </div>
        )}
        </div>
        <div className="overflow-x-auto">
        <DataGrid
            rows={transformedData}
            columns={columns}
            autoHeight
            apiRef={apiRef}
            loading={loading}
            initialState={{
                pagination: {
                paginationModel: { pageSize: 5, page: 0 },
                },
            }}
            sx={{
              borderRadius: '15px',
              '& .MuiDataGrid-container--top [role="row"], & .MuiDataGrid-container--bottom [role="row"]': {
                backgroundColor: '#E6E6E8',
                fontWeight: 'bold !important',
                fontSize: '14px',
              },
              '& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader': {
                fontWeight: 'bold !important',
                fontSize: '14px !important',  
                textTransform: 'uppercase', 
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            />
        </div>
        <Typography sx={{ marginBottom: 2, paddingLeft: 2, marginTop:3, fontWeight:'bold' }}>
          Total Summary
        </Typography>
        <TableContainer sx={{ borderRadius: '12px', border: '1px solid', borderColor:'#E6E6E8', marginTop:2 }}>
        <Table sx={{ borderRadius: '12px', overflow: 'hidden', }}>
        <TableHead sx={{ backgroundColor: '#E6E6E8' }}>
          <TableRow>
            <TableCell>Total Lalin Ruas</TableCell>
            <TableCell>Gol I</TableCell>
            <TableCell>Gol II</TableCell>
            <TableCell>Gol III</TableCell>
            <TableCell>Gol IV</TableCell>
            <TableCell>Gol V</TableCell>
            <TableCell>Total Lalin</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {totalRows.map((row) => (
            <TableRow key={row.ruas}>
              <TableCell>Total Lalin {row.ruas}</TableCell>
              <TableCell>{row.golI}</TableCell>
              <TableCell>{row.golII}</TableCell>
              <TableCell>{row.golIII}</TableCell>
              <TableCell>{row.golIV}</TableCell>
              <TableCell>{row.golV}</TableCell>
              <TableCell>{row.totalLalin}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell><strong>Total Lalin Ruas Keseluruhan</strong></TableCell>
            <TableCell><strong>{totalGolI}</strong></TableCell>
            <TableCell><strong>{totalGolII}</strong></TableCell>
            <TableCell><strong>{totalGolIII}</strong></TableCell>
            <TableCell><strong>{totalGolIV}</strong></TableCell>
            <TableCell><strong>{totalGolV}</strong></TableCell>
            <TableCell><strong>{totalLalinRuasKeseluruhan}</strong></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      </TableContainer>
      </div>
  )
}

export default LaporanPerhari
