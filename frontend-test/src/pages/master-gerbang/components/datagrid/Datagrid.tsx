import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip } from '@mui/material';
import { IGerbang } from '../../../../interfaces/gerbang';  // Import your interface
import { IDataGridProps } from './interfaces/interface';
import './Datagrid.css'
import { Delete, Edit, RemoveRedEye, Search } from '@mui/icons-material';




  const DataGridChild: React.FC<IDataGridProps> = ({ data, onEdit, onDelete, loading }) => {

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'No', width: 150 },
    { field: 'IdCabang', headerName: 'Id Cabang', width: 150 },
    { field: 'NamaGerbang', headerName: 'Gerbang Name', flex:1, minWidth: 180 },
    { field: 'NamaCabang', headerName: 'Cabang Name', flex:1, minWidth: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <Box flexDirection='row'>
          <Tooltip title='edit'>
          <IconButton onClick={() => onEdit(params.row)}>
            <Edit/>
          </IconButton>
          </Tooltip>

          <Tooltip title='view'>
          <IconButton onClick={() => onEdit(params.row)}>
            <RemoveRedEye />
          </IconButton>
          </Tooltip>

          <Tooltip title='delete'>
          <IconButton onClick={() => onDelete(params.row)}>
            <Delete color='error'/>
          </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
       <DataGrid
            columns={columns}
            rows={data}
            initialState={{
                pagination: {
                  paginationModel: { pageSize: 5, page: 0 },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
            getRowId={(row: IGerbang) => row.id}
            loading={loading}
            autoHeight
            disableColumnSelector
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
          />
    </div>
  );
};

export default DataGridChild;
