import '../scss/Login.scss';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ErrorMessage from './addons/Message';
import { setErrorMessage, setIsValid } from '../../utils/stores/features/login/loginSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData((formData) => ({
            ...formData,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { login, password } = formData;
        try {
            const res = await axios({
                method: 'POST',
                url: '/api/auth/login',
                data: {
                    login,
                    password,
                    remember
                }
            });
            if (res.status === 200) {
                dispatch(setIsValid(true));
                dispatch(setErrorMessage(null));
                navigate('/panel');
            }
        } catch (err) {
            dispatch(setIsValid(false));
            if (err.response.status === 429) {
                dispatch(setErrorMessage("Przekroczono ilość zapytań. Poczekaj kilka minut i spróbuj ponownie później."))
            } else dispatch(setErrorMessage(err.response.data.message));
        }
    };

    const handlePasswordShow = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword)
    }

    const errorMessage = useSelector(({ login }) => login.value.errorMessage);
    const isValid = useSelector(({ login }) => login.value.isValid);
    const error = !isValid ? <ErrorMessage message={errorMessage} /> : null;
    return (
        <>
            <div className='container'>
                <div className='login'>
                    <form className='login__form'>
                        <span className='form__title-login'>Logowanie</span>
                        {error}
                        <div className='form__container-input'>
                            <input
                                className='input-username input'
                                type='text'
                                name='login'
                                placeholder='Login'
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='form__container-input'>
                            <input
                                className='input-password input'
                                type={showPassword ? 'text' : 'password'}
                                name='password'
                                placeholder='Hasło'
                                onChange={handleChange}
                                required
                            />
                            <button type="button"
                                    className={!showPassword ? 'input-password input input-password__show' : 'input-password input input-password__show input-password__show--active'}
                                    onClick={(e) => handlePasswordShow(e)}>
                                    <i className='fa-solid fa-eye' />
                            </button>
                        </div>
                        <div className='form__remember-checkbox'>
                            <div className='remember-checkbox'>
                                <svg className='checkbox-symbol'>
                                    <symbol id='loginCheck' viewBox='0 0 12 10'>
                                        <polyline
                                            points='1.5 6 4.5 9 10.5 1'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                        />
                                    </symbol>
                                </svg>
                                <div className='remember-checkbox'>
                                    <input
                                        className='remember-checkbox__input'
                                        id='checkbox1'
                                        type='checkbox'
                                        value={remember}
                                        onChange={() => setRemember(!remember)}
                                    />
                                    <label className='remember-checkbox__label' htmlFor='checkbox1'>
                                    <span>
                                    <svg width='12px' height='10px'>
                                    <use xlinkHref='#loginCheck' />
                                    </svg>
                                    </span>
                                        <span>Zapamiętaj mnie</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='form__submit'>
                            <button className='submit' onClick={handleSubmit}>
                                Zaloguj się
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
