import React from 'react';
import '../../scss/addons/SelectForm.scss';
import { uniqueId } from '../../config/id-generator';

const SelectForm = ({
                        label,
                        values,
                        handleChange,
                        selected,
                        suffix,
                        maxContainerWidth = false
                    }
) => {
    let containerClasses = 'select-container';
    if (maxContainerWidth) {
        containerClasses = 'select-container select-container--max-width'
    }
    const id = uniqueId() + suffix;
    return (
        <>
            <div className={containerClasses}>
                <label htmlFor={`select${suffix}`} className='select-label'>
                    {label}
                </label>
                <select
                    id={id}
                    onChange={(event) => handleChange(event)}
                    name='select'
                    value={selected}
                    className='select-options'>
                    {values.map((value) => (
                        <option className='select-option' value={value.id} key={value.id}>
                            {value.message || value.role_pl || value.type_pl}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};

export default SelectForm;
