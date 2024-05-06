import './style.css'

import { useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

export function AlertDialog({ data, setData }) {
    const [open, setOpen] = useState(false);
	const [client, setClient] = useState('');
    const [product, setProduct] = useState('');
    const [orders, setOrders] = useState(0);
    
    const [ clientComplete, setClientComplete ] = useState(false)
    const [ productComplete, setProductComplete ] = useState(false)
    const [ ordersComplete, setOrdersComplete ] = useState(false)

    function errorComplete(func) {
        func(true)
        setTimeout(() => {
            func(false)
        }, 2500);
    }

    function validarInputs(client, product, orders) {

        if(client.trim() === '') errorComplete(setClientComplete)
        if(product.trim() === '') errorComplete(setProductComplete)
        if(orders === '0' || orders === '' || Number(orders) < 1) errorComplete(setOrdersComplete)

        if (client.trim() === '') {
            return 'O campo de cliente não pode estar vazio.';
        }
    
        if (product.trim() === '') {
            return 'O campo de produto não pode estar vazio.';
        }
    
        if (orders === '0' || orders === '' || Number(orders) < 1) {
            return 'A quantidade não pode ser zero.';
        }
    
        return '';
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const handleAddItem = async () => {
        const erro = validarInputs(client, product, orders);
        if (erro) {
            console.error('Erro ao adicionar o item:', erro);
            return;
        }

		const newItem = { "id": uuidv4(), "product": product, "client": client, "orders": Number(orders) };
		const newData = [...data, newItem];

		setData(newData);
		try {
            await axios.post('http://localhost:3001/rows', newItem); 
            console.log('Dados enviados com sucesso para o banco de dados!');
        } catch (error) {
            console.error('Erro ao enviar os dados para o banco de dados:', error);
        }

		setOpen(false);
        setClient('')
        setProduct('')
        setOrders('0')
	}

    return (
        <Fragment >
            <Button variant="contained" sx={{ padding: '10px 30px', display: 'flex', gap: '4px', height: '40px', maxWidth: '204px', lineHeight: 'normal' }} onClick={handleClickOpen}>
                <AddCircleOutlineOutlinedIcon />
                <span className='btnTextHeader'>Adicionar Item</span>
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Adicionar Pedido"}
                </DialogTitle>
                <DialogContent>
                    <TextField id="outlined-basic" label="Cliente" variant="outlined" sx={{ marginTop: '14px', width: '100%' }} onChange={(e) => setClient(e.target.value)} error={clientComplete}/>
                    <TextField id="outlined-basic" label="Produto" variant="outlined" sx={{ marginTop: '14px', width: '100%' }} onChange={(e) => setProduct(e.target.value)} error={productComplete}/>
                    <TextField 
                        id="outlined-basic" label="Quantidade" type='number' variant="outlined" 
                        sx={{ marginTop: '14px', width: '100%' }} 
                        onChange={(e) => setOrders(e.target.value)} 
                        error={ordersComplete}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleAddItem} autoFocus>Adicionar </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

AlertDialog.propTypes = {
    data: PropTypes.array.isRequired,
    setData: PropTypes.func.isRequired
};