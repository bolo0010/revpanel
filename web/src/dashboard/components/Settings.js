import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import avatar1 from '../img/avatar1.svg';
import '../scss/Settings.scss';
import Message from './addons/Message';
import Confirmation from './addons/Confirmation';
import InputForm from './addons/InputForm';
import MainButton from './addons/MainButton';
import {
    passwordValidation,
    userOptionalDataValidation
} from '../../utils/validators/user-data-form';
import ShowPassword from './addons/ShowPassword';
import { messageTimeout } from '../config/messages';
import { adminSuffix } from '../config/suffixes';
import { adminRoles } from '../config/id-roles';
import { setUser } from '../../utils/stores/features/user/userSlice';

const Settings = () => {
    const dispatch = useDispatch();
    const user = useSelector(({ user }) => user.value);

    const [values, setValues] = useState({
        firstName: user.firstName,
        secondName: user.secondName,
        nick: user.nick,
        dateOfBirth: user.dateOfBirth,
        title: user.title,
        province: user.province,
        city: user.city,
        phoneNumber: user.phoneNumber,
        inpost: user.inpost,
        role: user.role.role_pl,
        password1: '',
        password2: ''
    });
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const [confirmation, setConfirmation] = useState(null);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    useEffect(() => {
        if (!message) {
            setIsMessageVisible(false);
            return;
        }
        setIsMessageVisible(true);
        const timeout = setTimeout(() => {
            setIsMessageVisible(false);
        }, messageTimeout);
        return () => clearTimeout(timeout);
    }, [message]);

    const set = (name) => {
        return ({ target: { value } }) => {
            setValues((oldValues) => ({
                ...oldValues,
                [name]: !(name === 'city' || name === 'title') ? value.trim() : value.replace(/^\s+/g, '')
            }));
        };
    };

    const handlePasswordShow = (e, name) => {
        e.preventDefault();
        if (name === 'password1')
            setShowPassword1(!showPassword1);
        if (name === 'password2')
            setShowPassword2(!showPassword2);
    };

    const handleChangePassword = (event) => {
        event.preventDefault();
        const { valid, errorMessage } = passwordValidation(values);
        if (valid) {
            setConfirmation(
                <Confirmation
                    message={'Czy chcesz zapisać hasło?'}
                    title={'Potwierdzenie'}
                    handleConfirmation={handleChangePasswordRequest}
                />
            );
        } else {
            setMessage(<Message message={errorMessage} />);
            setMessageType('password');
        }
    };

    const handleChangePasswordRequest = async (option) => {
        setConfirmation(null);
        setMessageType('password');
        if (option)
            try {
                await axios({
                    method: 'PATCH',
                    url: '/api/users/',
                    withCredentials: true,
                    data: {
                        password: values.password1
                    }
                });
                setValues((values) => ({
                    ...values,
                    password1: '',
                    password2: ''
                }));
                setMessage(<Message message={'Hasło zostało zmienione.'} />);
            } catch (err) {
                setMessage(<Message message={err.response.data.message} />);
            }
    };

    const handleEditProfile = (event) => {
        event.preventDefault();
        const { valid, errorMessage } = userOptionalDataValidation(values);
        if (valid) {
            setConfirmation(
                <Confirmation
                    message={'Czy chcesz zapisać dane?'}
                    title={'Potwierdzenie'}
                    handleConfirmation={handleEditProfileRequest}
                />
            );
        } else {
            setMessage(<Message message={errorMessage} />);
            setMessageType('user');
        }
    };

    const handleEditProfileRequest = async (option) => {
        setConfirmation(null);
        setMessageType('user');
        if (!option) return;

        try {
            await axios({
                method: 'PATCH',
                url: '/api/users/',
                withCredentials: true,
                data: {
                    inpost: values.inpost,
                    province: values.province,
                    phoneNumber: values.phoneNumber,
                    city: values.city,
                    firstName: values.firstName,
                    secondName: values.secondName,
                    title: values.title,
                    dateOfBirth: values.dateOfBirth,
                    nick: values.nick
                }
            });
            setMessage(<Message message={'Dane zostały zmienione.'} />);
        } catch (err) {
            setMessage(<Message message={err.response.data.message} />);
        }

        try {
            const res = await axios({
                method: 'GET',
                url: '/api/users/current',
                withCredentials: true
            });
            dispatch(setUser(res.data));
        } catch (error) {
            setMessage(<Message message={error.response.data.message} />);
        }
    };

    return (
        <>
            <main className='settings'>
                {confirmation}
                <h2 className='settings__title'>Ustawienia konta</h2>
                <section className='about-me'>
                    <div className='about-me__avatar'>
                        <img src={avatar1} alt='Avatar' className='avatar' />
                    </div>
                    <div className='about-me__title'>
                        <p className='nick'>{values.nick}</p>
                        <p className='role'>{values.role}</p>
                        <p className='title'>{values.title}</p>
                    </div>
                </section>
                <section className='edit'>
                    <h3 className='edit__title'>Edytuj profil</h3>
                    {isMessageVisible && messageType === 'user' ? message : null}
                    <form onSubmit={handleEditProfile} className='edit__form form'>
                        <InputForm
                            inputName={'firstName'}
                            inputOnChange={set('firstName')}
                            labelName={'Imię'}
                            inputType={'text'}
                            inputValue={values.firstName}
                            inputDisabled={!adminRoles.includes(user.role.id)}
                            inputRequired={true}
                            suffix={adminSuffix}
                        />
                        <InputForm
                            inputName={'secondName'}
                            inputOnChange={set('secondName')}
                            labelName={'Nazwisko'}
                            inputType={'text'}
                            inputValue={values.secondName}
                            inputDisabled={!adminRoles.includes(user.role.id)}
                            inputRequired={true}
                            suffix={adminSuffix}
                        />
                        <InputForm
                            inputName={'dateOfBirth'}
                            inputOnChange={set('dateOfBirth')}
                            labelName={'Data urodzenia'}
                            inputType={'date'}
                            inputValue={values.dateOfBirth}
                            inputDisabled={!adminRoles.includes(user.role.id)}
                            inputRequired={true}
                            suffix={adminSuffix}
                        />
                        <InputForm
                            inputName={'nick'}
                            inputOnChange={set('nick')}
                            labelName={'Nick'}
                            inputType={'text'}
                            inputValue={values.nick}
                            inputDisabled={!adminRoles.includes(user.role.id)}
                            inputRequired={true}
                            suffix={adminSuffix}
                        />
                        <InputForm
                            inputName={'title'}
                            inputOnChange={set('title')}
                            labelName={'Tytuł'}
                            inputType={'title'}
                            inputValue={values.title}
                            inputDisabled={!adminRoles.includes(user.role.id)}
                            inputRequired={true}
                            suffix={adminSuffix}
                        />
                        <InputForm
                            inputName={'province'}
                            inputOnChange={set('province')}
                            labelName={'Województwo'}
                            inputType={'text'}
                            inputValue={values.province}
                            inputRequired={false}
                            suffix={adminSuffix}
                        />
                        <InputForm
                            inputName={'city'}
                            inputOnChange={set('city')}
                            labelName={'Miasto'}
                            inputType={'text'}
                            inputValue={values.city}
                            suffix={adminSuffix}
                        />
                        <InputForm
                            inputName={'phoneNumber'}
                            inputOnChange={set('phoneNumber')}
                            labelName={'Numer telefonu'}
                            inputType={'text'}
                            inputValue={values.phoneNumber}
                            suffix={adminSuffix}
                        />
                        <InputForm
                            inputName={'inpost'}
                            inputOnChange={set('inpost')}
                            labelName={'Paczkomat InPost'}
                            inputType={'text'}
                            inputValue={values.inpost}
                            suffix={adminSuffix}
                        />
                        <div className='form__submit'>
                            <MainButton type={'submit'} value={'Zapisz'} />
                        </div>
                    </form>
                </section>
                <section className='change-password'>
                    <h3 className='change-password__title'>Zmień hasło</h3>
                    {isMessageVisible && messageType === 'password' ? message : null}
                    <form onSubmit={handleChangePassword} className='change-password__form form'>
                        <InputForm
                            inputName={'password1'}
                            inputOnChange={set('password1')}
                            labelName={'Nowe hasło'}
                            inputType={showPassword1 ? 'text' : 'password'}
                            inputValue={values.password1}
                            passwordShowButton={<ShowPassword
                                handlePasswordShow={(e) => handlePasswordShow(e, 'password1')} />}
                            otherContainerClass={'input-form-container--password-show'}
                            suffix={adminSuffix}
                        />
                        <InputForm
                            inputName={'password2'}
                            inputOnChange={set('password2')}
                            labelName={'Powtórz hasło'}
                            inputType={showPassword2 ? 'text' : 'password'}
                            inputValue={values.password2}
                            passwordShowButton={<ShowPassword
                                handlePasswordShow={(e) => handlePasswordShow(e, 'password2')} />}
                            otherContainerClass={'input-form-container--password-show'}
                            suffix={adminSuffix}
                        />
                        <div className='form__submit'>
                            <MainButton type={'submit'} value={'Zapisz'} />
                        </div>
                    </form>
                </section>
            </main>
        </>
    );
};

export default Settings;
