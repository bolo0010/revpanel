import React from 'react';
import axios from 'axios';
import {useEffect, useState } from 'react';
import { startInitialDate } from '../../config/initial-dates';
import { PaginationBox } from '../addons/PaginationBox';
import { publicationSuffix } from '../../config/suffixes';
import { Table } from '../addons/Table';
import { useSelector } from 'react-redux';
import { publicationsColumns, publicationsDefaultColumn } from '../../config/publication-table-columns';
import { Search } from '../addons/Search';
import { SearchInputs } from './SearchInputs';
import { publicationSearchTypes } from '../../config/publication-search-types';
import moment from 'moment';
import TextEditor from './TextEditor';

const PublicationsTable = ({ setPublicationPopOut, disablePopOut }) => {
    //USER ROLE i ID
    const { role, id } = useSelector(({ user }) => user.value);

    //STATES---------------------------------------------------------------------------------------
    const [publications, setPublications] = useState([]);

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const [search, setSearch] = useState({
        value: '',
        fromDateCreate: startInitialDate,
        toDateCreate: moment(moment(new Date()).utc().format()).add(1, 'd').format('YYYY-MM-DD'),
        fromDateUpdate: startInitialDate,
        toDateUpdate: moment(moment(new Date()).utc().format()).add(1, 'd').format('YYYY-MM-DD'),
        fromDatePublish: startInitialDate,
        toDatePublish: moment(moment(new Date()).utc().format()).add(1, 'd').format('YYYY-MM-DD'),
        isArchived: -1,
    });
    const [searchCategory, setSearchCategory] = useState('title');
    const [sortBy, setSortBy] = useState({
        id: 'id',
        desc: 'false'
    });

    //USE EFFECTS----------------------------------------------------------------------------------
    useEffect(() => {
        retrievePublications({ sortBy });
    }, [page, pageSize, search, sortBy]);

    //HANDLERS-------------------------------------------------------------------------------------
    const getRequestParams = (page, pageSize) => {
        let params = {};
        if (page) {
            params.page = page - 1;
        }
        if (pageSize) {
            params.size = pageSize;
        }
        return params;
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPage(1);
    };

    const handleSearch = (event, type) => {
        if (type === publicationSearchTypes.STANDARD) {
            setSearch({
                value: event.target.value,
                fromDateCreate: startInitialDate,
                toDateCreate: moment(moment(new Date()).utc().format()).add(1, 'd').format('YYYY-MM-DD'),
                fromDateUpdate: startInitialDate,
                toDateUpdate: moment(moment(new Date()).utc().format()).add(1, 'd').format('YYYY-MM-DD'),
                fromDatePublish: startInitialDate,
                toDatePublish: moment(moment(new Date()).utc().format()).add(1, 'd').format('YYYY-MM-DD'),
                isArchived: -1,
            });
        } else if (type === publicationSearchTypes.FROMDATE_CREATE) {
            setSearch((values) => ({
                ...values,
                value: '',
                isArchived: -1,
                fromDateCreate: event.target.value
            }));
        } else if (type === publicationSearchTypes.TODATE_CREATE) {
            setSearch((values) => ({
                ...values,
                value: '',
                isArchived: -1,
                toDateCreate: event.target.value
            }));
        } else if (type === publicationSearchTypes.FROMDATE_UPDATE) {
            setSearch((values) => ({
                ...values,
                value: '',
                isArchived: -1,
                fromDateUpdate: event.target.value
            }));
        } else if (type === publicationSearchTypes.TODATE_UPDATE) {
            setSearch((values) => ({
                ...values,
                value: '',
                isArchived: -1,
                toDateUpdate: event.target.value
            }));
        } else if (type === publicationSearchTypes.FROMDATE_PUBLISH) {
            setSearch((values) => ({
                ...values,
                value: '',
                isArchived: -1,
                fromDatePublish: event.target.value
            }));
        } else if (type === publicationSearchTypes.TODATE_PUBLISH) {
            setSearch((values) => ({
                ...values,
                value: '',
                isArchived: -1,
                toDatePublish: event.target.value
            }));
        } else if (type === publicationSearchTypes.ISARCHIVED) {
            setSearch({
                value: '',
                fromDateCreate: startInitialDate,
                toDateCreate: moment(moment(new Date()).utc().format()).add(1, 'd').format('YYYY-MM-DD'),
                fromDateUpdate: startInitialDate,
                toDateUpdate:moment(moment(new Date()).utc().format()).add(1, 'd').format('YYYY-MM-DD'),
                fromDatePublish: startInitialDate,
                toDatePublish: moment(moment(new Date()).utc().format()).add(1, 'd').format('YYYY-MM-DD'),
                isArchived: event.target.value
            });
        }
    };

    const handleCategorySearchChange = (event) => {
        setSearchCategory(event.target.value);
    };

    const handleEdit = (publication_id) => {
        setPublicationPopOut(<TextEditor publication_id={publication_id} refreshTable={retrievePublications} disablePopout={disablePopOut} />);
    };

    //REQUESTS-------------------------------------------------------------------------------------
    const retrievePublications = async () => {
        const params = getRequestParams(page, pageSize);

        params.searchQuery = search.value;
        params.searchFromDateCreateQuery = search.fromDateCreate;
        params.searchToDateCreateQuery = search.toDateCreate;
        params.searchFromDateUpdateQuery = search.fromDateUpdate;
        params.searchToDateUpdateQuery = search.toDateUpdate;
        params.searchFromDatePublishQuery = search.fromDatePublish;
        params.searchToDatePublishQuery = search.toDatePublish;
        params.searchIsArchived = search.isArchived;
        params.searchCategory = searchCategory;
        params.sortBy = sortBy;

        try {
            const res = await axios({
                method: 'GET',
                url: '/api/publications',
                withCredentials: true,
                params
            });
            const { rows, totalPages, totalItems } = res.data;
            if (res.status === 200 && totalItems === 0) {
                setPublications([{
                        id: '-1',
                        title: 'Brak publikacji do wyświetlenia.',
                    }]
                );
            }
            else if (res.status === 200) {
                setPublications(rows);
            }
            setCount(totalPages);
        } catch (err) {
            setPublications([{
                    id: '-1',
                    title: 'Brak danych.',
                    author: {
                        nick: 'Spróbuj ponownie później.'
                    },
                }]
            );
        }
    };

    //RENDERS
    return (
        <div className='table-container'>
            <div className='table-settings'>
                <PaginationBox
                    count={count}
                    page={page}
                    pageSize={pageSize}
                    handlePageSizeChange={handlePageSizeChange}
                    handlePageChange={handlePageChange}
                    suffix={publicationSuffix}
                />
                <Search
                    searchCategory={searchCategory}
                    handleCategorySearchChange={handleCategorySearchChange}
                    suffix={publicationSuffix}
                    columns={publicationsColumns()}
                    inputs={<SearchInputs
                        search={search}
                        searchCategory={searchCategory}
                        handleSearch={handleSearch}
                    />}
                />
            </div>
            <Table
                handleEdit={handleEdit}
                values={publications}
                setSortBy={setSortBy}
                cellProps={{role: role.id, id}}
                Columns={publicationsColumns}
                DefaultColumn={publicationsDefaultColumn}
            />
        </div>
    );
};

export default PublicationsTable;
