import React from 'react';
import '../../scss/addons/MainButton.scss';

const MainButton = ({ value, type, onClick = () => {}, isDisabled = false }) => {
    const className = isDisabled ? { className: `main-button--disabled main-button` } : { className: 'main-button' }
    return (
        <button type={type} onClick={onClick} {...className}>
            {value}
        </button>
    );
};

export default MainButton;
