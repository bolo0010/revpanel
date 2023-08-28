import React from 'react';
import '../../scss/addons/ConfirmationButtons.scss';

const ConfirmationButtons = ({ handleConfirmation, cancel, ok, type = 'button', isDisabled = false }) => {
    const className = !isDisabled ?
        { className: `buttons-confirmation` } :
        { className: 'buttons-confirmation buttons-confirmation--disabled' };
    const disabled = !isDisabled ?
        { disabled: false } :
        { disabled: true };
    return (
        <div className='buttons-container'>
            <button className='buttons-cancel' type='button' onClick={() => handleConfirmation(false)}>
                {cancel}
            </button>
            <button
                {...className}
                {...disabled}
                onClick={() => handleConfirmation(true)}
                type={type}>
                {ok}
            </button>
        </div>
    );
};

export default ConfirmationButtons;
