import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmationButtons from '../addons/ConfirmationButtons';
import InputForm from '../addons/InputForm';
import SelectForm from '../addons/SelectForm';
import {
    passwordValidation,
    userOptionalDataValidation,
    userRequiredDataValidation
} from '../../../utils/validators/user-data-form';
import Message from '../addons/Message';
import Confirmation from '../addons/Confirmation';
import { startInitialDate } from '../../config/initial-dates';
import ShowPassword from '../addons/ShowPassword';
import { adminSuffix } from '../../config/suffixes';
import '../../scss/Admin/Edit.scss';

const Edit = ({ user_id, popout, refreshTable }) => {
    const [values, setValues] = useState({
        email: '',
        nick: '',
        firstName: '',
        secondName: '',
        dateOfBirth: startInitialDate,
        title: '',
        province: '',
        city: '',
        phoneNumber: '',
        inpost: '',
        id_role: '0',
        password1: '',
        password2: '',
        isActive: 1,
        isTermsAccepted: 1
    });

    const [roles, setRoles] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [confirmation, setConfirmation] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [disableButtonOnError, setDisableButtonOnError] = useState(false);

    useEffect(() => {
        setDisableButtonOnError(false);
        getRoles();
    }, []);

    const isActiveOptions = [
        {
            id: 0,
            message: 'Nieaktywne'
        },
        {
            id: 1,
            message: 'Aktywne'
        }
    ];

    const isTermsAcceptedOptions = [
        {
            id: 0,
            message: 'Nie zaakceptowany'
        },
        {
            id: 1,
            message: 'Zaakceptowany'
        }
    ];

    const getRoles = async () => {
        setIsLoading(true);
        try {
            const res = await axios({
                method: 'GET',
                url: '/api/roles',
                withCredentials: true
            });
            if (res.status === 200) {
                setRoles(res.data);
                getUser();
            }
        } catch (err) {
            setRoles([
                {
                    id: '0',
                    role_pl: 'Brak wyboru'
                }
            ]);
            setErrorMessage('Wystąpił błąd! Proszę spróbować później.');
            setDisableButtonOnError(true);
        }
        setIsLoading(false);
    };

    const getUser = async () => {
        setIsLoading(true);
        try {
            const res = await axios({
                method: 'GET',
                url: `/api/users/${user_id}`,
                withCredentials: true,
            });
            if (res.status === 200) {
                setValues({
                    email: res.data.email,
                    nick: res.data.nick,
                    firstName: res.data.firstName,
                    secondName: res.data.secondName,
                    dateOfBirth: res.data.dateOfBirth,
                    title: res.data.title,
                    province: res.data.province,
                    city: res.data.city,
                    phoneNumber: res.data.phoneNumber,
                    inpost: res.data.inpost,
                    id_role: res.data.role.id,
                    isActive: res.data.isActive,
                    isTermsAccepted: res.data.isTermsAccepted,
                    password1: '',
                    password2: ''
                });
            }
        } catch (err) {
            setErrorMessage(err.response.data.message || 'Przepraszamy, spróbuj ponownie później.')
            setDisableButtonOnError(true);
        }
        setIsLoading(false);
    };

    const handlePasswordShow = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword)
    }

    const handleRoleChange = (event) => {
        setValues((values) => ({
            ...values,
            id_role: event.target.value
        }));
    };

    const handleActivityChange = (event) => {
        setValues((values) => ({
            ...values,
            isActive: event.target.value
        }));
    };

    const handleTermsChange = (event) => {
        setValues((values) => ({
            ...values,
            isTermsAccepted: event.target.value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let passwordValid = { valid: true, errorMessage: '' };
        if (values.password1)
            passwordValid = passwordValidation(values);
        const userRequiredDataValid = userRequiredDataValidation(values);
        const userOptionalDataValid = userOptionalDataValidation(values);
        if (passwordValid.valid && userRequiredDataValid.valid && userOptionalDataValid.valid) {
            setConfirmation(
                <Confirmation
                    message={'Czy chcesz zatwierdzić edycję?'}
                    title={'Potwierdzenie'}
                    handleConfirmation={handleUpdateUserRequest}
                />
            );
        } else if (!passwordValid.valid) {
            setErrorMessage(passwordValid.errorMessage);
        } else if (!userRequiredDataValid.valid) {
            setErrorMessage(userRequiredDataValid.errorMessage);
        } else if (!userOptionalDataValid.valid) {
            setErrorMessage(userOptionalDataValid.errorMessage);
        } else {
            setErrorMessage('Przepraszamy, spróbuj ponownie później.');
            setDisableButtonOnError(true);
        }
    };

    const handleUpdateUserRequest = async (option) => {
        setConfirmation(null);
        if (option)
            try {
                const res = await axios({
                    method: 'PATCH',
                    url: `/api/users/${user_id}`,
                    withCredentials: true,
                    data: {
                        ...values,
                        password: values.password1
                    }
                });
                if (res.status === 200) {
                    setErrorMessage(res.data.message);
                    refreshTable();
                }
            } catch (err) {
                setErrorMessage(err.response.data.message);
                setDisableButtonOnError(true);
            }
    };

    const disablePopUp = (option) => {
        if (!option) popout(null);
    };

    const set = (name) => {
        return ({ target: { value } }) => {
            setValues((oldValues) => ({
                ...oldValues,
                [name]: !(name === 'city' || name === 'title') ? value.trim() : value.replace(/^\s+/g, '')
            }));
        };
    };

    const errMessage = errorMessage ? <Message message={errorMessage} /> : null;

    if (isLoading) {
        return (
            <>
                <div className='admin-edit'>
                    <p>Ładowanie...</p>
                </div>
                <div className='admin-edit__background' />
            </>
        );
    }

    return (
        <>
            <div className='admin-edit'>
                {confirmation}
                <div className='admin-edit__title'>Edytuj użytkownika {values.nick}</div>
                <form onSubmit={handleSubmit} className='admin-edit__form'>
                    {errMessage}
                    <InputForm
                        inputName={'firstName'}
                        labelName={'Imię'}
                        inputType={'text'}
                        inputRequired={true}
                        inputOnChange={set('firstName')}
                        inputValue={values.firstName}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'secondName'}
                        labelName={'Nazwisko'}
                        inputType={'text'}
                        inputRequired={true}
                        inputOnChange={set('secondName')}
                        inputValue={values.secondName}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'nick'}
                        labelName={'Nick'}
                        inputType={'text'}
                        inputRequired={true}
                        inputOnChange={set('nick')}
                        inputValue={values.nick}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'email'}
                        labelName={'Email'}
                        inputType={'text'}
                        inputRequired={true}
                        inputOnChange={set('email')}
                        inputValue={values.email}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'title'}
                        labelName={'Tytuł'}
                        inputType={'text'}
                        inputRequired={false}
                        inputOnChange={set('title')}
                        inputValue={values.title}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'province'}
                        labelName={'Województwo'}
                        inputType={'text'}
                        inputRequired={false}
                        inputOnChange={set('province')}
                        inputValue={values.province}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'city'}
                        labelName={'Miasto'}
                        inputType={'text'}
                        inputRequired={false}
                        inputOnChange={set('city')}
                        inputValue={values.city}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'phoneNumber'}
                        labelName={'Numer telefonu'}
                        inputType={'text'}
                        inputRequired={false}
                        inputOnChange={set('phoneNumber')}
                        inputValue={values.phoneNumber}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'inpost'}
                        labelName={'Paczkomat InPost'}
                        inputType={'text'}
                        inputRequired={false}
                        inputOnChange={set('inpost')}
                        inputValue={values.inpost}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'dateOfBirth'}
                        labelName={'Data urodzenia'}
                        inputType={'date'}
                        inputRequired={true}
                        inputOnChange={set('dateOfBirth')}
                        inputValue={values.dateOfBirth}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'password'}
                        labelName={'Nowe hasło'}
                        inputType={showPassword ? 'text' : 'password'}
                        inputRequired={false}
                        inputOnChange={set('password1')}
                        inputValue={values.password1}
                        passwordShowButton={<ShowPassword handlePasswordShow={(e) => handlePasswordShow(e)}/>}
                        otherContainerClass={'input-form-container--password-show'}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'password'}
                        labelName={'Powtórz nowe hasło'}
                        inputType={'password'}
                        inputRequired={false}
                        inputOnChange={set('password2')}
                        inputValue={values.password2}
                        suffix={adminSuffix}
                    />
                    <SelectForm
                        label={'Rola'}
                        values={roles}
                        handleChange={handleRoleChange}
                        selected={values.id_role}
                        suffix={adminSuffix}
                    />
                    <SelectForm
                        label={'Regulamin'}
                        values={isTermsAcceptedOptions}
                        selected={values.isTermsAccepted}
                        handleChange={handleTermsChange}
                        suffix={adminSuffix}
                    />
                    <SelectForm
                        label={'Stan konta'}
                        values={isActiveOptions}
                        selected={values.isActive}
                        handleChange={handleActivityChange}
                        suffix={adminSuffix}
                    />
                    <ConfirmationButtons
                        ok={'Zatwierdź'}
                        cancel={'Anuluj'}
                        type={'submit'}
                        handleConfirmation={disablePopUp}
                        isDisabled={disableButtonOnError}
                    />
                </form>
            </div>
            <div className='admin-edit__background' />
        </>
    );
};

export default Edit;
