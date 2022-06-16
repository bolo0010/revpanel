import axios from 'axios';
import { useEffect, useState } from 'react';
import ConfirmationButtons from '../addons/ConfirmationButtons';
import InputForm from '../addons/InputForm';
import SelectForm from '../addons/SelectForm';
import { passwordValidation, userRequiredDataValidation } from '../../../utils/validators/user-data-form';
import Message from '../addons/Message';
import Confirmation from '../addons/Confirmation';
import { startInitialDate } from '../../config/initial-dates';
import ShowPassword from '../addons/ShowPassword';
import '../../scss/Admin/Add.scss';
import { adminSuffix } from '../../config/suffixes';

const Add = ({setAddPopUp}) => {
    const [values, setValues] = useState({
        email: '',
        nick: '',
        firstName: '',
        secondName: '',
        title: '',
        dateOfBirth: startInitialDate,
        id_role: '0',
        password1: '',
        password2: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [confirmation, setConfirmation] = useState(null);
    const [roles, setRoles] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [disableButtonOnError, setDisableButtonOnError] = useState(false);


    useEffect(() => {
        getRoles();
        setDisableButtonOnError(false);
    }, []);

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
            }
        } catch (err) {
            setRoles([
                {
                    id: '0',
                    role_pl: 'Brak wyboru.'
                }
            ]);
            setErrorMessage('Wystąpił błąd! Proszę spróbować później.')
            setDisableButtonOnError(true);
        }
        setIsLoading(false);
    };

    const disablePopUp = (option) => {
        if (!option) setAddPopUp(null);
    }

    const handleRoleChange = (event) => {
        setValues((values) => ({
            ...values,
            id_role: String(event.target.value)
        }));
    };

    const set = (name) => {
        return ({ target: { value } }) => {
            setValues((oldValues) => ({
                ...oldValues,
                [name]: name !== 'title' ? value.trim() : value.replace(/^\s+/g, '')
            }));
        };
    };

    const handlePasswordShow = (e, name) => {
        e.preventDefault();
        if (name === 'password1')
            setShowPassword1(!showPassword1)
        if (name === 'password2')
            setShowPassword2(!showPassword2)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const passwordValid = passwordValidation(values);
        const userDataValid = userRequiredDataValidation(values);
        if (passwordValid.valid && userDataValid.valid) {
            setConfirmation(
                <Confirmation
                    message={'Czy chcesz dodać nowego użytkownika?'}
                    title={'Potwierdzenie'}
                    handleConfirmation={handleAddUserRequest}
                />
            );
        } else if (!passwordValid.valid) {
            setErrorMessage(passwordValid.errorMessage)
        } else if (!userDataValid.valid) {
            setErrorMessage(userDataValid.errorMessage)
        } else {
            setErrorMessage('Przepraszamy, spróbuj ponownie później.')
            setDisableButtonOnError(true);
        }
    }

    const handleAddUserRequest = async (option) => {
        setConfirmation(null);
        if (option)
            try {
                const res = await axios({
                    method: 'POST',
                    url: '/api/users/',
                    withCredentials: true,
                    data: {
                        ...values,
                        password: values.password1
                    }
                });
                if (res.status === 200) {
                    setValues({
                        email: '',
                        nick: '',
                        firstName: '',
                        secondName: '',
                        title: '',
                        dateOfBirth: startInitialDate,
                        id_role: '0',
                        password1: '',
                        password2: ''
                    });
                    setErrorMessage(res.data.message);
                }
            } catch (err) {
                setErrorMessage(err.response.data.message || 'Przepraszamy, spróbuj ponownie później.')
                setDisableButtonOnError(true);
            }
    }

    const errMessage = errorMessage ? <Message message={errorMessage} /> : null;

    if (isLoading) {
        return (
            <>
                <div className="admin-add">
                    <p>Ładowanie...</p>
                </div>
                <div className="admin-add__background" />
            </>
        );
    }

    return (
        <>
            <div className="admin-add">
                {confirmation}
                <div className="admin-add__title">Dodaj nowego użytkownika</div>
                <form onSubmit={handleSubmit} className="admin-add__form">
                    {errMessage}
                    <InputForm
                        inputName={'firstName'}
                        labelName={'Imię'}
                        inputType={'text'}
                        inputRequired={'true'}
                        inputOnChange={set('firstName')}
                        inputValue={values.firstName}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'secondName'}
                        labelName={'Nazwisko'}
                        inputType={'text'}
                        inputRequired={'true'}
                        inputOnChange={set('secondName')}
                        inputValue={values.secondName}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'nick'}
                        labelName={'Nick'}
                        inputType={'text'}
                        inputRequired={'true'}
                        inputOnChange={set('nick')}
                        inputValue={values.nick}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'email'}
                        labelName={'Email'}
                        inputType={'text'}
                        inputRequired={'true'}
                        inputOnChange={set('email')}
                        inputValue={values.email}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'dateOfBirth'}
                        labelName={'Data urodzenia'}
                        inputType={'date'}
                        inputRequired={'true'}
                        inputOnChange={set('dateOfBirth')}
                        inputValue={values.dateOfBirth}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'title'}
                        labelName={'Tytuł'}
                        inputType={'text'}
                        inputRequired={'true'}
                        inputOnChange={set('title')}
                        inputValue={values.title}
                        suffix={adminSuffix}
                    />
                    <SelectForm
                        label={'Rola'}
                        values={roles}
                        handleChange={handleRoleChange}
                        selected={values.id_role}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'password'}
                        labelName={'Hasło'}
                        inputType={showPassword1 ? 'text' : 'password'}
                        inputRequired={'true'}
                        inputOnChange={set('password1')}
                        inputValue={values.password1}
                        passwordShowButton={<ShowPassword handlePasswordShow={(e) => handlePasswordShow(e, 'password1')}/>}
                        otherContainerClass={'input-form-container--password-show'}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputName={'password'}
                        labelName={'Powtórz hasło'}
                        inputType={showPassword2 ? 'text' : 'password'}
                        inputRequired={'true'}
                        inputOnChange={set('password2')}
                        inputValue={values.password2}
                        passwordShowButton={<ShowPassword handlePasswordShow={(e) => handlePasswordShow(e, 'password2')}/>}
                        otherContainerClass={'input-form-container--password-show'}
                        suffix={adminSuffix}
                    />
                    <ConfirmationButtons
                        ok={'Dodaj'}
                        cancel={'Anuluj'}
                        type={'submit'}
                        handleConfirmation={disablePopUp}
                        isDisabled={disableButtonOnError}
                    />
                </form>
            </div>
            <div className="admin-add__background" />
        </>
    );
};

export default Add;
