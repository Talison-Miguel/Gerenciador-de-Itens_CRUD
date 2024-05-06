import './style.css'

import PropTypes from 'prop-types';
import axios from 'axios';

import { EditDeleteActions } from '../EditDeleteActions';
import { DataGrid } from '@mui/x-data-grid';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';

export function List({data, setData}) {
    const isMobile = useMediaQuery('(max-width: 780px)');

    async function handleDelete(id) {
        const newData = data.filter(item => item.id !== id);
        setData(newData)
        try {
            const response = await axios.delete(`http://localhost:3001/rows/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao remover o item:', error);
            throw error;
        }
    }
    
    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5},
        { field: 'client', headerName: 'Cliente', flex: 1},
        { field: 'product', headerName: 'Produto', flex: 1},
        {
            field: 'orders',
            headerName: 'Quantidade de Pedidos',
            flex: 1,
        },
        { 
            field: 'edit', 
            headerName: '', 
            flex: 1.5,
            renderCell: (params) => (
                <EditDeleteActions id={params.row.id} onDelete={handleDelete} data={data} setData={setData}/>
            ) 
        },
    ];

    return (
        <section className='listContainer'>
            <Box sx={{  padding: isMobile ? '0 10px': '0 20px', width: isMobile ? '100%' : '80%' }} className='list'>
                <DataGrid
                    className="customDataGrid"
                    rows={data}
                    columns={columns}
                    initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 9 },
                    },
                    }}
                    pageSizeOptions={[5, 8, 10, 12]}
                />
            </Box>
        </section>
    );
}

List.propTypes = {
    data: PropTypes.array.isRequired,
    setData: PropTypes.func
};