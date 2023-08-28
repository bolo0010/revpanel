import React from 'react';
import {
    publicationColumnsAccessors,
    publicationColumnsHeaders,
    publicationColumnsQueries
} from './publication-table-variables';
import { publicationStates } from './publication-states';

export const publicationsColumns =
    () => ([
            {
                Header: publicationColumnsHeaders.TITLE,
                accessor: publicationColumnsAccessors.TITLE,
                query: publicationColumnsQueries.TITLE
            },
            {
                Header: publicationColumnsHeaders.AUTHOR,
                accessor: publicationColumnsAccessors.AUTHOR,
                query: publicationColumnsQueries.AUTHOR
            },
            {
                Header: publicationColumnsHeaders.CORRECTOR,
                accessor: publicationColumnsAccessors.CORRECTOR,
                query: publicationColumnsQueries.CORRECTOR
            },
            {
                Header: publicationColumnsHeaders.PUBLISHER,
                accessor: publicationColumnsAccessors.PUBLISHER,
                query: publicationColumnsQueries.PUBLISHER
            },
            {
                Header: publicationColumnsHeaders.STATE,
                accessor: publicationColumnsAccessors.STATE,
                query: publicationColumnsQueries.STATE,
                Cell: (props) => {
                    if (!props.row.original.publications_state) return <span></span>;
                    const { id, status } = props.row.original.publications_state;
                    switch (id) {
                        case publicationStates.DRAFT:
                            return <span style={{ color: 'gray' }}>{status}</span>;
                        case publicationStates.FOR_CORRECTION:
                            return <span style={{ color: 'darkkhaki' }}>{status}</span>;
                        case publicationStates.IN_CORRECTION:
                            return <span style={{ color: 'cadetblue' }}>{status}</span>;
                        case publicationStates.TO_PUBLISH:
                            return <span style={{ color: 'blue' }}>{status}</span>;
                        case publicationStates.PUBLISHED:
                            return <span style={{ color: 'green' }}>{status}</span>;
                        case publicationStates.ARCHIVED:
                            return <span style={{ color: 'red' }}>{status}</span>;
                    }
                }
            },
            {
                Header: publicationColumnsHeaders.TYPE,
                accessor: publicationColumnsAccessors.TYPE,
                query: publicationColumnsQueries.TYPE
            },
            {
                Header: publicationColumnsHeaders.ROUTE,
                accessor: publicationColumnsAccessors.ROUTE,
                query: publicationColumnsQueries.ROUTE
            },
            {
                Header: publicationColumnsHeaders.CREATEDAT,
                accessor: publicationColumnsAccessors.CREATEDAT,
                query: publicationColumnsQueries.CREATEDAT
            },
            {
                Header: publicationColumnsHeaders.UPDATEDAT,
                accessor: publicationColumnsAccessors.UPDATEDAT,
                query: publicationColumnsQueries.UPDATEDAT
            },
            {
                Header: publicationColumnsHeaders.PUBLISHEDAT,
                accessor: publicationColumnsAccessors.PUBLISHEDAT,
                query: publicationColumnsQueries.PUBLISHEDAT
            },
            {
                Header: publicationColumnsHeaders.ISARCHIVED,
                accessor: publicationColumnsAccessors.ISARCHIVED,
                query: publicationColumnsQueries.ISARCHIVED,
                Cell: (props) => {
                    return props.value ? 'Tak' : 'Nie';
                }
            },
            {
                Header: publicationColumnsHeaders.ACTIONS,
                accessor: publicationColumnsAccessors.ACTIONS,
                disableSortBy: true,
                sticky: 'right',
                Cell: (props) => {
                    const publication_id = props.row.original.id;
                    return (
                        publication_id !== '-1'
                            ? (
                                <div>
                                    <span onClick={() => props.handleEdit(publication_id)}>
                                        <i className='far fa-edit action mr-2 publication-edit__icon' />
                                    </span>
                                </div>
                            ) : null
                    );
                }
            }
        ]
    );

export const publicationsDefaultColumn =
    () => ({
        minWidth: 30,
        width: 125,
        maxWidth: 400
    });

