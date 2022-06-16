import { useEffect, useMemo, useState } from 'react';
import { useBlockLayout, useResizeColumns, useSortBy, useTable } from 'react-table';
import { useSticky } from 'react-table-sticky';
import '../../scss/addons/Table.scss';
import Spinner from './Spinner';

export const Table = ({ values, handleEdit, setSortBy, cellProps = {}, Columns, DefaultColumn }) => {
    const [spinner, setSpinner] = useState(<Spinner/>)

    const columns = useMemo(Columns, []);
    const defaultColumn = useMemo(DefaultColumn, []);
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state: { sortBy } }
        = useTable(
        {
            columns,
            data: values,
            defaultColumn,
            manualSortBy: true,
            disableMultiSort: true
        },
        useResizeColumns,
        useBlockLayout,
        useSticky,
        useSortBy
    );

    useEffect(() => {
        setSortBy(sortBy);
        return () => {
            setSpinner(null);
        };
    }, [sortBy]);

    return (
        <table className={values.length < 1 ? 'table spinner-container' : 'table'} {...getTableProps()}>
            <thead className='table__thead'>
            {headerGroups.map((headerGroup) => (
                <tr className='table-row' {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                        <th className='thead-column' {...column.getHeaderProps(column.getSortByToggleProps({ title: undefined }))}>
                            {column.render('Header')}
                            <div
                                {...column.getResizerProps()}
                                className={`table-resizer ${
                                    column.isResizing ? 'isResizing' : ''

                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            />
                            <span
                                className={column.isSorted ? (column.isSortedDesc ? 'table-sort-desc' : 'table-sort-asc') : ''}
                            />
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody className='table__tbody' {...getTableBodyProps()}>
            {
                values.length < 1
                    ? <tr className='table-row'>
                        <td className='spinner-row'>
                            {spinner}
                        </td>
                    </tr>
                    : rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr className='table-row' {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td className='tbody-row' {...cell.getCellProps()}>
                                            {cell.render('Cell', { handleEdit, ...cellProps })}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};