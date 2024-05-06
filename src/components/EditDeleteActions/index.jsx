import './style.css'

import * as React from 'react';
import P from 'prop-types';
import axios from 'axios';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button as ButtonSet, useMediaQuery} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export function EditDeleteActions({ id, onDelete, data, setData }) {
    const isMobile = useMediaQuery('(max-width: 780px)');

    const [open, setOpen] = React.useState(false);
    const [itemEdit, setItemEdit] = React.useState({});

    const [ clientComplete, setClientComplete ] = React.useState(false)
    const [ productComplete, setProductComplete ] = React.useState(false)
    const [ ordersComplete, setOrdersComplete ] = React.useState(false)

    function errorComplete(func) {
        func(true)
        setTimeout(() => {
            func(false)
        }, 2500);
    }

    function validarInputs(cliente, produto, quantidade) {
        if(cliente.trim() === '') errorComplete(setClientComplete)
        if(produto.trim() === '') errorComplete(setProductComplete)
        if(quantidade === '0' || quantidade === '') errorComplete(setOrdersComplete)

        if (cliente.trim() === '') {
            return 'O campo de cliente não pode estar vazio.';
        }
    
        if (produto.trim() === '') {
            return 'O campo de produto não pode estar vazio.';
        }
    
        if (quantidade === '0' || quantidade === '') {
            return 'A quantidade não pode ser zero.';
        }
        
        return '';
    }

    const handleDelete = () => {
        onDelete(id); 
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleEdit = () => {
        const erro = validarInputs(itemEdit.client, itemEdit.product, itemEdit.orders);
        if (erro) {
            console.error('Erro ao adicionar o item:'   );
            return;
        }

        const updatedData = data.map(item => {
            if (item.id === itemEdit.id) {
                return itemEdit; 
            } else {
                return item; 
            }
        });

        axios.put(`http://localhost:3001/rows/${itemEdit.id}`, itemEdit)
            .then(response => {
                console.log('Item atualizado com sucesso:', response.data);
            })
            .catch(error => {
                console.error('Erro ao atualizar o item:', error);
            });

        setData(updatedData);
        setOpen(false);
    }

    const handleClickOpen = () => {
        setOpen(true);
        const selectedItem = data.find(item => item.id === id);
        setItemEdit(selectedItem);
    }

    const handleChange = (prop) => (event) => {
        setItemEdit({ ...itemEdit, [prop]: prop === 'orders' ? (event.target.value < 1 ? 1 : event.target.value) : event.target.value});
    };

    return (
        <div className='containerButtons'>
            <React.Fragment>
                <ButtonSet variant={isMobile ? "text" : "outlined"} sx={{  padding: '4px 10px', display: 'flex', gap: '10px', height: '36px', fontSize: '10px', width: '110px' }} onClick={handleClickOpen}>
                    <EditIcon sx={[{ fontSize: '26px', color: '#1976d2' }, isMobile && {fontSize: '20px'}]}/>
                    <span className='btnText'>Editar</span>
                </ButtonSet>
                <ButtonSet variant={isMobile ? "text" : "outlined"} sx={{  padding: '4px 10px', display: 'flex', gap: '10px', height: '36px', fontSize: '10px', width: '110px' }} onClick={handleDelete}>
                    <DeleteIcon sx={[{ fontSize: '26px', color: '#1976d2' }, isMobile && {fontSize: '20px'}]}/>
                    <span className='btnText'>Remover</span>
                </ButtonSet>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Editar Pedido"}
                    </DialogTitle>
                    <DialogContent sx={{ maxWidth: '100%' }}>
                        <TextField id="outlined-basic" label="Cliente" variant="outlined" sx={{ marginTop: '14px', width: '100%' }} onChange={handleChange('client')} value={itemEdit.client} error={clientComplete}/>
                        <TextField id="outlined-basic" label="Produto" variant="outlined" sx={{ marginTop: '14px', width: '100%' }} onChange={handleChange('product')} value={itemEdit.product} error={productComplete}/>
                        <TextField 
                            id="outlined-basic" label="Quantidade" type='number' variant="outlined" 
                            sx={{ marginTop: '14px', width: '100%' }} 
                            onChange={handleChange('orders')} 
                            value={itemEdit.orders} 
                            error={ordersComplete}
                        />
                    </DialogContent>
                    <DialogActions sx={{ marginLeft: '20px' }}>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleEdit} autoFocus>Salvar </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </div>
    )
}

EditDeleteActions.propTypes = {
    data: P.array.isRequired,
    setData: P.func.isRequired,
    id: P.string.isRequired,
    onDelete: P.func.isRequired
};