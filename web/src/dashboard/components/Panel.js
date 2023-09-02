import React from 'react';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Header from './Header';
import Home from './Home/Home';
import Footer from './Footer';
import Nav from './Nav';
import Publications from './Publications/Publications';
import Settings from './Settings/Settings';
import Admin from './Admin/Admin';
import { setAdminRoute, setUser } from '../../utils/stores/features/user/userSlice';
import Confirmation from './addons/Confirmation';
import Terms from './addons/Terms';
import { setErrorMessage, setIsValid } from '../../utils/stores/features/login/loginSlice';
import '../scss/Panel.scss';
import { AdminsGroup } from '../config/roles';

const Panel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [access, setAccess] = useState({
        auth: false,
        terms: false,
        active: false
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isHamburgerClicked, setIsHamburgerClicked] = useState(false);

    useEffect(() => {
        setTimeout(function() {
            let viewheight = window.outerHeight;
            let viewwidth = window.outerWidth;
            let viewport = document.querySelector('meta[name=viewport]');
            viewport.setAttribute(
                'content',
                'height=' + viewheight + ', width=' + viewwidth + ', initial-scale=1.0'
            );
        }, 300);
    }, []);

    useEffect(() => {
        checkIsUserLogged();
    }, [access.auth, access.terms, access.active]);

    const checkIsUserLogged = async () => {
        setIsLoading(true);
        try {
            const res = await axios({
                method: 'GET',
                url: '/api/auth/is-logged',
                withCredentials: true
            });
            setAccess({
                auth: res.data.isLogged,
                terms: res.data.isTermsAccepted,
                active: res.data.isActive
            });
            if (access.auth) {
                dispatch(setUser(res.data.user));
                checkIsAdmin(res.data.user.role.id);
                dispatch(setIsValid(true));
                dispatch(setErrorMessage(null));
                if (!access.terms) {
                    dispatch(setIsValid(false));
                    dispatch(setErrorMessage(res.data.message));
                }
            }
        } catch (err) {
            setAccess({
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
            setAccess((isAuth) => ({
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
            } catch (err) {
                dispatch(setIsValid(false));
                dispatch(setErrorMessage(err.response.data.message));
            }
        } else {
            navigate('/login');
        }
    };

    const checkIsAdmin = (id_role) => {
        if (AdminsGroup.includes(id_role)) {
            dispatch(setAdminRoute(true));
        } else {
            dispatch(setAdminRoute(false));
        }
    };
    const toggleMobileMenu = () => {
        setIsHamburgerClicked(!isHamburgerClicked);
    };

    const panelRoutes = (
        <>
            <Header toggleMobileMenu={toggleMobileMenu} isHamburgerClicked={isHamburgerClicked} />
            <Nav isHamburgerClicked={isHamburgerClicked} setIsHamburgerClicked={setIsHamburgerClicked} />
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
    const showPanel = access.auth ? panelRoutes : returnToLogin;
    const panel = isLoading ? null : showPanel;
    const showTerms = access.active && !access.terms ? (
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
