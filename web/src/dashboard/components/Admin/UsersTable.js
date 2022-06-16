import axios from 'axios';
import { cloneElement, useEffect, useMemo, useState } from 'react';
import { startInitialDate } from '../../config/initial-dates';
import { adminSearchTypes } from '../../config/admin-search-types';
import { PaginationBox } from '../addons/PaginationBox';
import { adminSuffix } from '../../config/suffixes';
import { Search } from '../addons/Search';
import { Table } from '../addons/Table';
import { useSelector } from 'react-redux';
import { usersColumns, usersDefaultColumn } from '../../config/admin-user-table-columns';
import { SearchInputs } from './SearchInputs';
import moment from 'moment';

const UsersTable = ({ editPopout }) => {
    //USER ROLE
    const role = useSelector(({ user }) => user.value.role.id);

    //STATES---------------------------------------------------------------------------------------
    const [users, setUsers] = useState([]);

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const [search, setSearch] = useState({
        value: '',
        fromDate: startInitialDate,
        toDate: moment(moment(new Date()).utc().format()).add(1, 'd').format('YYYY-MM-DD'),
        active: -1,
        terms: -1
    });
    const [searchCategory, setSearchCategory] = useState('nick');
    const [sortBy, setSortBy] = useState({
        id: 'id',
        desc: 'false'
    });

    const [isEditPopoutVisible, setIsEditPopoutVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    //USE EFFECTS----------------------------------------------------------------------------------
    useEffect(() => {
        retrieveUsers({ sortBy });
    }, [page, pageSize, search, sortBy]);

    //HANDLERS-------------------------------------------------------------------------------------
    const disableEditPopout = () => {
        setIsEditPopoutVisible(false);
    };

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
        if (type === adminSearchTypes.STANDARD) {
            setSearch({
                fromDate: startInitialDate,
                toDate: moment(moment(new Date()).utc().format()).add(1, 'd').format('YYYY-MM-DD'),
                value: event.target.value,
                active: -1,
                terms: -1
            });
        } else if (type === adminSearchTypes.FROMDATE) {
            setSearch((values) => ({
                ...values,
                value: '',
                active: -1,
                terms: -1,
                fromDate: event.target.value
            }));
        } else if (type === adminSearchTypes.TODATE) {
            setSearch((values) => ({
                ...values,
                value: '',
                active: -1,
                terms: -1,
                toDate: event.target.value
            }));
        } else if (type === adminSearchTypes.ISACTIVE) {
            setSearch({
                value: '',
                fromDate: startInitialDate,
                toDate: moment(moment(new Date()).utc().format()).add(1, 'd').format('YYYY-MM-DD'),
                terms: -1,
                active: event.target.value
            });
        } else if (type === adminSearchTypes.ISTERMSACCEPTED) {
            setSearch({
                value: '',
                fromDate: startInitialDate,
                toDate: moment(moment(new Date()).utc().format()).add(1, 'd').format('YYYY-MM-DD'),
                active: -1,
                terms: event.target.value
            });
        }
    };

    const handleCategorySearchChange = (event) => {
        setSearchCategory(event.target.value);
    };

    const handleEdit = (user_id) => {
        setIsEditPopoutVisible(true);
        setSelectedUserId(user_id);
    };

    //REQUESTS-------------------------------------------------------------------------------------
    const retrieveUsers = async () => {
        const params = getRequestParams(page, pageSize);

        params.searchQuery = search.value;
        params.searchFromDateQuery = search.fromDate;
        params.searchToDateQuery = search.toDate;
        params.searchIsActive = search.active;
        params.searchIsTermsAccepted = search.terms;
        params.searchCategory = searchCategory;
        params.sortBy = sortBy;

        try {
            const res = await axios({
                method: 'GET',
                url: '/api/users',
                withCredentials: true,
                params
            });
            const { users, totalPages, totalItems } = res.data;
            if (res.status === 200 && totalItems === 0) {
                setUsers([{
                        id: '-1',
                        nick: 'Brak użytkowników do wyświetlenia.',
                        email: '',
                        role: {
                            id: '-1'
                        }
                    }]
                );
            } else if (res.status === 200) {
                setUsers(users);
            }
            setCount(totalPages);
        } catch (err) {
            setUsers([{
                    id: '-1',
                    nick: 'Brak danych.',
                    email: 'Spróbuj ponownie później.',
                    role: {
                        id: '-1'
                    }
                }]
            );
        }
    };

    //RENDERS
    const edit = isEditPopoutVisible ? cloneElement(
        editPopout,
        { user_id: selectedUserId, popout: disableEditPopout, refreshTable: retrieveUsers }
    ) : null;

    return (
        <div className='table-container'>
            {edit}
            <div className='table-settings'>
                <PaginationBox
                    count={count}
                    page={page}
                    pageSize={pageSize}
                    handlePageSizeChange={handlePageSizeChange}
                    handlePageChange={handlePageChange}
                    suffix={adminSuffix}
                />
                <Search
                    searchCategory={searchCategory}
                    handleCategorySearchChange={handleCategorySearchChange}
                    suffix={adminSuffix}
                    columns={usersColumns()}
                    inputs={<SearchInputs
                        search={search}
                        searchCategory={searchCategory}
                        handleSearch={handleSearch}
                    />}
                />
            </div>
            <Table
                handleEdit={handleEdit}
                values={users}
                setSortBy={setSortBy}
                cellProps={{ role }}
                Columns={usersColumns}
                DefaultColumn={usersDefaultColumn}
            />
        </div>
    );
};

export default UsersTable;
