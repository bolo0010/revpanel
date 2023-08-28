import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { CSVLink } from "react-csv";
import moment from 'moment';
import Add from './Add';
import Edit from './Edit';
import UsersTable from './UsersTable';
import MainButton from '../addons/MainButton';
import Confirmation from '../addons/Confirmation';
import TermsEdit from './TermsEdit';
import '../../scss/Admin/Admin.scss';


const Admin = () => {
    const [confirmation, setConfirmation] = useState(null);
    const [addPopUp, setAddPopUp] = useState(null);
    const [changeTermsForm, setChangeTermsForm] = useState(null);
    const [usersDataCSV, setUsersDataCSV] = useState({data: [{"brak_danych": "0"}], isDataDownloaded: false});

    const handleCancelTerms = () => {
        setConfirmation(<Confirmation
            message={'Czy chcesz unieważnić regulamin? (Nie dotyczy kont z rolą Administrator i Główny Administrator)'}
            title={'Potwierdzenie'}
            handleConfirmation={handleCancelTermsRequest}
        />);
    };

    const handleBlockAllUsers = () => {
        setConfirmation(<Confirmation
            message={'Czy chcesz zablokować wszystkich użytkowników? (Nie dotyczy kont z rolą Administrator i Główny Administrator)'}
            title={'Potwierdzenie'}
            handleConfirmation={handleBlockAllUsersRequest}
        />);
    };

    const handleDownloadAllUserData = (event, done) => {
        if (!usersDataCSV.isDataDownloaded) {
            handleDownloadAllUserDataRequest();
            done(false);
        } else done(true);
    };

    const handleAddUser = () => {
        setAddPopUp(<Add setAddPopUp={setAddPopUp}/>);
    }

    const handleCancelTermsRequest = async (option) => {
        setConfirmation(null);
        if (!option) return;
        try {
            const res = await axios({
                method: 'PATCH',
                url: '/api/users/all',
                withCredentials: true,
                data: {
                    isTermsAccepted: false
                }
            });
            if (res.status === 200) {
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleBlockAllUsersRequest = async (option) => {
        setConfirmation(null);
        if (!option) return;
        try {
            const res = await axios({
                method: 'PATCH',
                url: '/api/users/all',
                withCredentials: true,
                data: {
                    isActive: false
                }
            });
            if (res.status === 200) {
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDownloadAllUserDataRequest = async () => {
        try {
            const res = await axios({
                method: 'GET',
                url: '/api/users',
                withCredentials: true,
                params: {
                    page: 0,
                    size: Number.MAX_SAFE_INTEGER
                }
            });
            if (res.status === 200) {
                const users = res.data.rows.map((user) => {return {...user, role: user.role.role_pl}})
                setUsersDataCSV({data: users, isDataDownloaded: true})
            }
        } catch (err) {
            console.error(err);
            setUsersDataCSV(({data}) => ({...data, isDataDownloaded: false}))
        }
    }

    const showChangeTermsPrompt = () => {
        const terms = <TermsEdit setChangeTermsForm={setChangeTermsForm}/>;
        setChangeTermsForm(terms);
    }

    const csvDownloadButton = (
        <CSVLink
            data={usersDataCSV.data}
            separator={';'}
            filename={`users-${moment().format("YYYY-MM-DD")}.csv`}
            target="_blank"
            className="main-button main-button--disable-decoration"
            asyncOnClick={true}
            onClick={handleDownloadAllUserData}
        >
            {!usersDataCSV.isDataDownloaded ? "Wygeneruj plik CSV" : "Pobierz plik CSV"}
        </CSVLink>
    )


    const adminRoute = (
        <>
            <main className='admin'>
                <div className='admin-control'>
                    {confirmation}
                    {changeTermsForm}
                    {addPopUp}
                    <UsersTable editPopout={<Edit/>}/>
                    <div className='admin-control__buttons'>
                        <div className='control-button control-add'>
                            <MainButton onClick={handleAddUser} type={'button'} value={'Dodaj użytkownika'} />
                        </div>
                        <div className='control-button__other-buttons'>
                            <div className='control-button control-cancel-terms'>
                                <MainButton onClick={handleCancelTerms} type={'button'}
                                            value={'Unieważnij regulamin'} />
                            </div>
                            <div className='control-button control-block-all'>
                                <MainButton onClick={handleBlockAllUsers} type={'button'}
                                            value={'Zablokuj wszystkie konta'} />
                            </div>
                            <div className='control-button control-download-all-data'>
                                {csvDownloadButton}
                            </div>
                            <div className='control-button control-change-terms-prompt'>
                                <MainButton onClick={showChangeTermsPrompt} type={'button'} value={'Zmień komunikat o akceptacji regulaminu'} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );

    const noPermissionRoute = (
        <>
            <main className='admin'>
                <p className='no-permission'>Nie posiadasz uprawnień aby zobaczyć tę podstronę!</p>
            </main>
        </>
    );

    const render = !useSelector(({user}) => user.value.adminRoute) ? noPermissionRoute : adminRoute;

    return <>{render}</>;
};

export default Admin;
