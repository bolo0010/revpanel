import React from 'react';
import { Pagination } from '@mui/material';
import { paginationSizes } from '../../config/pagination-sizes';
import '../../scss/addons/PaginationBox.scss';

export const PaginationBox = ({ count, page, pageSize, handlePageChange, handlePageSizeChange, suffix }) => (
    <div className='table-pagination'>
        <div className='pagination-select'>
            <label htmlFor={`pagination${suffix}`} className='pagination-page-label'>Wyników na
                stronie:</label>
            <select onChange={handlePageSizeChange} id={`pagination${suffix}`} value={pageSize}
                    className='pagination-page-select' name='table-pagination'>
                {paginationSizes.map((size) => (
                    <option key={size} value={size}>
                        {size}
                    </option>
                ))}
            </select>
        </div>
        <Pagination
            className='pagination__selectors'
            count={count}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            variant='outlined'
            shape='rounded'
            onChange={handlePageChange}
        />
    </div>
);