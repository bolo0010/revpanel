import React from 'react';
import ConfirmationButtons from './ConfirmationButtons';
import '../../scss/addons/Confirmation.scss';

const Confirmation = ({ message, title, handleConfirmation }) => {
    return (
        <>
            <div className="confirmation-container">
                <div className="confirmation-title">{title}</div>
                <div className="confirmation-text">{message}</div>
                <ConfirmationButtons handleConfirmation={handleConfirmation} cancel={'Nie'} ok={'Tak'} />
            </div>
            <div className="confirmation-background" />
        </>
    );
};

export default Confirmation;
