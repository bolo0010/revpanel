import * as React from 'react';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import '../scss/Panel.scss';
import Header from './Header';
import Home from './Home/Home';
import Footer from './Footer';
import Nav from './Nav';
import Publications from './Publications/Publications';
import Settings from './Settings';
import Admin from './Admin/Admin';
import { setAdminRoute, setUser } from '../../utils/stores/features/user/userSlice';
import Confirmation from './addons/Confirmation';
import Terms from './addons/Terms';
import { adminRoles } from '../config/id-roles';
import { setErrorMessage, setIsValid } from '../../utils/stores/features/login/loginSlice';

const Panel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isAuth, setIsAuth] = useState({
        auth: false,
        terms: false,
        active: false
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isHamburgerClicked, setIsHamburgerClicked] = useState(false);

    useEffect(() => {
        setTimeout(function () {
            let viewheight = window.outerHeight;
            let viewwidth = window.outerWidth;
            let viewport = document.querySelector("meta[name=viewport]");
            viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0");
        }, 300);
    }, []);


    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const res = await axios({
                method: 'GET',
                url: '/api/auth/isLogged',
                withCredentials: true
            });
            setIsAuth({
                auth: res.data.isLogged,
                terms: res.data.isTermsAccepted,
                active: res.data.isActive
            });
            if (isAuth.auth) {
                dispatch(setUser(res.data.user));
                checkIsAdmin(res.data.user.role.id);
                dispatch(setIsValid(true));
                dispatch(setErrorMessage(null));
                if (!isAuth.terms) {
                    dispatch(setIsValid(false));
                    dispatch(setErrorMessage(res.data.message));
                }
            }
        } catch (err) {
            setIsAuth({
                auth: false,
                terms: false,
                active: false
            });
            dispatch(setIsValid(false));
            dispatch(setErrorMessage(err.response.data.message));
        }
        setIsLoading(false);
    };

    const handleTermsAccept = async (option) => {
        if (option) {
            setIsAuth((isAuth) => ({
                ...isAuth,
                terms: true
            }));
            try {
                await axios({
                    method: 'PATCH',
                    url: '/api/users/',
                    withCredentials: true,
                    data: {
                        isTermsAccepted: true
                    }
                });
            } catch (error) {
                //TODO zrobić error (może podstrona błędu?)
            }
        } else {
            navigate('/login');
        }
    };

    const checkIsAdmin = (role_id) => {
        if (adminRoles.includes(role_id)) dispatch(setAdminRoute(true));
        else dispatch(setAdminRoute(false));
    };

    const toggleMobileMenu = () => {
        setIsHamburgerClicked(!isHamburgerClicked);
    };

    useEffect(() => {
        checkAuth();
    }, [isAuth.auth, isAuth.terms, isAuth.active]);

    const panelRoutes = (
        <>
            <Header toggleMobileMenu={toggleMobileMenu} isHamburgerClicked={isHamburgerClicked}/>
            <Nav isHamburgerClicked={isHamburgerClicked} setIsHamburgerClicked={setIsHamburgerClicked}/>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/publications' element={<Publications />} />
                <Route path='/settings' element={<Settings />} />
                <Route path='/admin' element={<Admin />} />
            </Routes>
            <Footer />
        </>
    );

    const returnToLogin = <Navigate to='/login' replace />;
    const showPanel = isAuth.auth ? panelRoutes : returnToLogin;
    const panel = isLoading ? null : showPanel;
    const showTerms = isAuth.active && !isAuth.terms ? (
        <Confirmation
            message={<Terms />}
            title={'Akceptacja regulaminu'}
            handleConfirmation={handleTermsAccept}
        />
    ) : null;
    const terms = isLoading ? null : showTerms;

    return (
        <>
            {terms}
            {panel}
        </>
    );
};

export default Panel;
