import { CalendarToday, FileDownload, Filter, FilterAlt, KeyboardArrowDown, Search } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridApi, GridColDef, GridToolbar, GridToolbarExport, useGridApiRef } from '@mui/x-data-grid';
import { DatePicker, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';


import moment, { Moment } from 'moment';
import React, { useRef, useState } from 'react'

interface TrafficData {
    id: number;
    ruas: string;
    gerbang: string;
    gardu: string;
    hari: string;
    tanggal: string;
    metodePembayaran: string;
    golI: number;
    golII: number;
    golIII: number;
    golIV: number;
    golV: number;
    totalLalin: number;
  }
  

  
  const initialData: TrafficData[] = [
    { id: 1, ruas: 'Ruas 1', gerbang: 'Gerbang 1', gardu: '01', hari: 'Kamis', tanggal: '30-05-2024', metodePembayaran: 'Tunai', golI: 567, golII: 234, golIII: 12, golIV: 10, golV: 8, totalLalin: 831 },
    { id: 2, ruas: 'Ruas 1', gerbang: 'Gerbang 2', gardu: '01', hari: 'Rabu', tanggal: '29-05-2024', metodePembayaran: 'Tunai', golI: 456, golII: 345, golIII: 23, golIV: 12, golV: 9, totalLalin: 986 },
    { id: 3, ruas: 'Ruas 1', gerbang: 'Gerbang 3', gardu: '02', hari: 'Selasa', tanggal: '28-05-2024', metodePembayaran: 'Tunai', golI: 768, golII: 345, golIII: 34, golIV: 13, golV: 7, totalLalin: 897 },
    { id: 4, ruas: 'Ruas 2', gerbang: 'Gerbang 4', gardu: '02', hari: 'Senin', tanggal: '27-05-2024', metodePembayaran: 'Tunai', golI: 890, golII: 577, golIII: 23, golIV: 14, golV: 9, totalLalin: 987 },
    { id: 5, ruas: 'Ruas 2', gerbang: 'Gerbang 5', gardu: '02', hari: 'Minggu', tanggal: '26-05-2024', metodePembayaran: 'Tunai', golI: 1435, golII: 1234, golIII: 34, golIV: 15, golV: 8, totalLalin: 2304 },
    { id: 6, ruas: 'Ruas 2', gerbang: 'Gerbang 6', gardu: '03', hari: 'Sabtu', tanggal: '25-05-2024', metodePembayaran: 'Tunai', golI: 2454, golII: 1256, golIII: 12, golIV: 16, golV: 7, totalLalin: 3459 },
  ];

const LaporanPerhari = () => {

const [data, setData] = useState<TrafficData[]>(initialData);
  const [search, setSearch] = useState<string>('');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [date, setDate] = useState<Moment | null>(null);
  const apiRef = useGridApiRef();


  const handleFilter = () => {
    const filteredData = initialData.filter((item) => {
      const searchTerm = search.toLowerCase();
      const itemDate = moment(item.tanggal, 'DD-MM-YYYY');
      const matchesSearch = searchTerm === '' || 
        item.ruas.toLowerCase().includes(searchTerm) ||
        item.gerbang.toLowerCase().includes(searchTerm) ||
        item.gardu.toLowerCase().includes(searchTerm) ||
        item.hari.toLowerCase().includes(searchTerm) ||
        item.metodePembayaran.toLowerCase().includes(searchTerm);
      const matchesDate = !date || itemDate.isSame(date, 'day');
      return matchesSearch && matchesDate;
    });
    setData(filteredData);
  };

  const handleReset = () => {
    setSearch('');
    setDate(null);
    setData(initialData);
  };

  const handlePaymentFilter = (paymentMethod: string) => {
    const filteredData = initialData.filter(item => item.metodePembayaran === paymentMethod);
    setData(filteredData);
  };

  const handleExport = () => {
    if (apiRef.current) {
        apiRef.current.exportDataAsCsv();
      }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'No.', width: 70 },
    { field: 'ruas', headerName: 'Ruas', width: 130 },
    { field: 'gerbang', headerName: 'Gerbang', width: 130 },
    { field: 'gardu', headerName: 'Gardu', width: 130 },
    { field: 'hari', headerName: 'Hari', width: 130 },
    { field: 'tanggal', headerName: 'Tanggal', width: 130 },
    { field: 'metodePembayaran', headerName: 'Metode Pembayaran', width: 180 },
    { field: 'golI', headerName: 'Gol I', width: 100 },
    { field: 'golII', headerName: 'Gol II', width: 100 },
    { field: 'golIII', headerName: 'Gol III', width: 100 },
    { field: 'golIV', headerName: 'Gol IV', width: 100 },
    { field: 'golV', headerName: 'Gol V', width: 100 },
    { field: 'totalLalin', headerName: 'Total Lalin', width: 130 },
  ];

  
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
          <div className="flex space-x-4 mb-2 w-1/2">
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
            <div className=" w-full">
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
            <Button 
               variant="contained"
               className="!p-3 !rounded-full hover:!bg-blue-500"
               style={{backgroundColor:'rgb(25, 118, 210)', minWidth:'120px'}}
              onClick={handleFilter}>
              Filter
            </Button>
            <Button 
               variant="outlined"
               className='!rounded-full !py-3 !text-black !border-gray-500'
               style={{ minWidth:'120px'}}
              onClick={handleReset}
            >
              Reset
            </Button>
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
        <div className="mb-6">
          <div className="flex space-x-4 overflow-x-auto">
            <Button variant="contained" onClick={() => handlePaymentFilter('Tunai')}>
              Total Tunai
            </Button>
            <Button variant="contained" onClick={() => handlePaymentFilter('E-Toll')}>
              Total E-Toll
            </Button>
            <Button variant="contained" onClick={() => handlePaymentFilter('Flo')}>
              Total Flo
            </Button>
            <Button variant="contained" onClick={() => handlePaymentFilter('KTP')}>
              Total KTP
            </Button>
            <Button variant="contained" onClick={() => handlePaymentFilter('Keseluruhan')}>
              Total Keseluruhan
            </Button>
            <Button variant="contained" onClick={() => handlePaymentFilter('E-Toll+Tunai+Flo')}>
              Total E-Toll+Tunai+Flo
            </Button>
            <Button variant="contained" color="primary" onClick={handleExport} startIcon={<FileDownload />}>
              Export
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
        <DataGrid
            rows={data}
            columns={columns}
            checkboxSelection
            autoHeight
            apiRef={apiRef}
            initialState={{
                pagination: {
                paginationModel: { pageSize: 5, page: 0 },
                },
            }}
            pageSizeOptions={[5, 10, 20]} // Updated prop
            />
        </div>
      </div>
  )
}

export default LaporanPerhari
