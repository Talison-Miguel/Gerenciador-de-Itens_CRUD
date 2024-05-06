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
	const [cliente, setCliente] = useState('');
    const [produto, setProduto] = useState('');
    const [quantidade, setQuantidade] = useState(0);
    
    const [ clientComplete, setClientComplete ] = useState(false)
    const [ productComplete, setProductComplete ] = useState(false)
    const [ ordersComplete, setOrdersComplete ] = useState(false)

    function errorComplete(func) {
        func(true)
        setTimeout(() => {
            func(false)
        }, 2500);
    }

    function validarInputs(cliente, produto, quantidade) {

        if(cliente.trim() === '') errorComplete(setClientComplete)
        if(produto.trim() === '') errorComplete(setProductComplete)
        if(quantidade === '0' || quantidade === '' || Number(quantidade) < 1) errorComplete(setOrdersComplete)

        if (cliente.trim() === '') {
            return 'O campo de cliente não pode estar vazio.';
        }
    
        if (produto.trim() === '') {
            return 'O campo de produto não pode estar vazio.';
        }
    
        if (quantidade === '0' || quantidade === '' || Number(quantidade) < 1) {
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
        const erro = validarInputs(cliente, produto, quantidade);
        if (erro) {
            console.error('Erro ao adicionar o item:', erro);
            return;
        }

		const newItem = { "id": uuidv4(), "product": produto, "client": cliente, "orders": Number(quantidade) };
		const newData = [...data, newItem];

		setData(newData);
		try {
            await axios.post('http://localhost:3001/rows', newItem); 
            console.log('Dados enviados com sucesso para o banco de dados!');
        } catch (error) {
            console.error('Erro ao enviar os dados para o banco de dados:', error);
        }

		setOpen(false);
        setCliente('')
        setProduto('')
        setQuantidade('0')
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
                    <TextField id="outlined-basic" label="Cliente" variant="outlined" sx={{ marginTop: '14px', width: '100%' }} onChange={(e) => setCliente(e.target.value)} error={clientComplete}/>
                    <TextField id="outlined-basic" label="Produto" variant="outlined" sx={{ marginTop: '14px', width: '100%' }} onChange={(e) => setProduto(e.target.value)} error={productComplete}/>
                    <TextField 
                        id="outlined-basic" label="Quantidade" type='number' variant="outlined" 
                        sx={{ marginTop: '14px', width: '100%' }} 
                        onChange={(e) => setQuantidade(e.target.value)} 
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