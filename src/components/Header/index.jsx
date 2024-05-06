import './style.css'
import PropTypes from 'prop-types';

import { AlertDialog } from '../AlertDialog/index'

export function Header({ data, setData }) {
    return (
        <header className='header'>
            <div className='ItensMenu'>
                <h1 className='titleList'>Painel de Administração</h1>
                <AlertDialog data={data} setData={setData}/>
            </div>
        </header>
    )
}

Header.propTypes = {
    data: PropTypes.array.isRequired,
    setData: PropTypes.func.isRequired
};