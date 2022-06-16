import { useState } from 'react';
import '../../scss/addons/ShowPassword.scss';

const ShowPassword = ({ handlePasswordShow }) => {
    const [active, setActive] = useState(false);

    return (
        <button type='button' className={!active ? 'password-show' : 'password-show password-show--active'} onClick={
            (e) => {
                setActive(!active);
                handlePasswordShow(e);
            }}>
            <i className='fa-solid fa-eye' />
        </button>
    );
};

export default ShowPassword;