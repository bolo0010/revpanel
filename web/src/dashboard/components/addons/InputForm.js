import React from 'react';
import { uniqueId } from '../../config/id-generator';
import '../../scss/addons/InputForm.scss';

const InputForm = ({
    labelName,
    inputName,
    inputType,
    inputValue,
    suffix,
    inputOnChange = null,
    inputDisabled = false,
    inputRequired = false,
    passwordShowButton = null,
    otherContainerClass = "",
}) => {
    const isRequired = inputRequired ? { required: 'required' } : { 'data-not-required': '' };
    const isDisabled = inputDisabled ? { disabled: 'disabled' } : { 'data-not-disabled': '' };
    const containerClass = otherContainerClass ? { className: `${otherContainerClass} input-form-container` } : { className: 'input-form-container' }
    const id = uniqueId() + suffix;
    return (
        <div {...containerClass}>
            <label htmlFor={id} className="input-form-label">
                {labelName}
            </label>
            <input
                className="input-form-input"
                type={inputType}
                name={inputName}
                id={id}
                value={inputValue}
                onChange={inputOnChange}
                {...isDisabled}
                {...isRequired}
            />
            {passwordShowButton}
        </div>
    );
};

export default InputForm;
