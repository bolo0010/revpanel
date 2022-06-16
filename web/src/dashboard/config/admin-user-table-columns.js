import {
    TERMS_ACCEPTED,
    TERMS_NO_ACCEPTED,
    USER_IS_ACTIVE,
    USER_IS_NO_ACTIVE,
    userColumnsAccessors,
    userColumnsHeaders,
    userColumnsQueries
} from './admin-user-table-variables';
import { adminRoles, mainAdminRole } from './id-roles';

export const usersColumns =
    () => ([
            {
                Header: userColumnsHeaders.NICK,
                accessor: userColumnsAccessors.NICK,
                query: userColumnsQueries.NICK
            },
            {
                Header: userColumnsHeaders.EMAIL,
                accessor: userColumnsAccessors.EMAIL,
                query: userColumnsQueries.EMAIL
            },
            {
                Header: userColumnsHeaders.FIRSTNAME,
                accessor: userColumnsAccessors.FIRSTNAME,
                query: userColumnsQueries.FIRSTNAME
            },
            {
                Header: userColumnsHeaders.SECONDNAME,
                accessor: userColumnsAccessors.SECONDNAME,
                query: userColumnsQueries.SECONDNAME
            },
            {
                Header: userColumnsHeaders.DATEOFBIRTH,
                accessor: userColumnsAccessors.DATEOFBIRTH,
                query: userColumnsQueries.DATEOFBIRTH
            },
            {
                Header: userColumnsHeaders.ROLE,
                accessor: userColumnsAccessors.ROLE,
                query: userColumnsQueries.ROLE,
            },
            {
                Header: userColumnsHeaders.TITLE,
                accessor: userColumnsAccessors.TITLE,
                query: userColumnsQueries.TITLE
            },
            {
                Header: userColumnsHeaders.PROVINCE,
                accessor: userColumnsAccessors.PROVINCE,
                query: userColumnsQueries.PROVINCE
            },
            {
                Header: userColumnsHeaders.CITY,
                accessor: userColumnsAccessors.CITY,
                query: userColumnsQueries.CITY
            },
            {
                Header: userColumnsHeaders.PHONENUMBER,
                accessor: userColumnsAccessors.PHONENUMBER,
                query: userColumnsQueries.PHONENUMBER
            },
            {
                Header: userColumnsHeaders.INPOST,
                accessor: userColumnsAccessors.INPOST,
                query: userColumnsQueries.INPOST
            },
            {
                Header: userColumnsHeaders.ISTERMSACCEPTED,
                accessor: userColumnsAccessors.ISTERMSACCEPTED,
                query: userColumnsQueries.ISTERMSACCEPTED,
                Cell: (props) => {
                    return props.value ? TERMS_ACCEPTED : TERMS_NO_ACCEPTED;
                }
            },
            {
                Header: userColumnsHeaders.ISACTIVE,
                accessor: userColumnsAccessors.ISACTIVE,
                query: userColumnsQueries.ISACTIVE,
                Cell: (props) => {
                    return props.value ? USER_IS_ACTIVE : USER_IS_NO_ACTIVE;
                }
            },
            {
                Header: userColumnsHeaders.ACTIONS,
                accessor: userColumnsAccessors.ACTIONS,
                disableSortBy: true,
                sticky: 'right',
                Cell: (props) => {
                    const user_id = props.row.original.id;
                    const role_id = props.row.original.role.id;
                    const disableEdit = (props.role !== mainAdminRole && adminRoles.includes(role_id)) || role_id === '-1';
                    return (
                        <div>
                            <span onClick={() => props.handleEdit(user_id)} className={disableEdit ? 'admin-edit--disable' : null}>
                                <i className='far fa-edit action mr-2 admin-edit__icon' />
                            </span>
                        </div>
                    );
                }
            }
        ]
    );

export const usersDefaultColumn =
    () => ({
        minWidth: 30,
        width: 125,
        maxWidth: 400
    });

