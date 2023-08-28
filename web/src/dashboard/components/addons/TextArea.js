import React from 'react';
import { uniqueId } from '../../config/id-generator';
import '../../scss/addons/TextArea.scss';

const TextArea = ({
                      textAreaName,
                      textAreaValue,
                      textAreaRows,
                      textAreaColumns,
                      textAreaOnChange = null,
                      textAreaDisabled = false,
                      textAreaRequired = false,
                      otherContainerClass = ''
                  }) => {
    const isRequired = textAreaRequired ? { required: 'required' } : { 'data-not-required': '' };
    const isDisabled = textAreaDisabled ? { disabled: 'disabled' } : { 'data-not-disabled': '' };
    const containerClass = otherContainerClass ? { className: `${otherContainerClass} text-area-form-container` } : { className: 'text-area-form-container' };
    const id = uniqueId();
    return (
        <div {...containerClass}>
            <label htmlFor={id} className='text-area-form-label'>
                {textAreaName}
            </label>
            <textarea
                className='text-area-form-input'
                name={textAreaName}
                id={id}
                rows={textAreaRows}
                cols={textAreaColumns}
                value={textAreaValue}
                onChange={textAreaOnChange}
                {...isDisabled}
                {...isRequired}
            />
        </div>
    );
};

export default TextArea;
