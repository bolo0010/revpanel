import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../scss/Nav.scss';

const Nav = ({isHamburgerClicked, setIsHamburgerClicked}) => {
    const handleLogout = async () => {
        await axios({
            method: 'GET',
            url: '/api/auth/logout'
        });
    };

    const adminRoute = (
        <li className="nav-link" onClick={() => setIsHamburgerClicked(false)}>
            <Link to="/panel/admin" className="nav-link__link ">
                Administracja
            </Link>
        </li>
    )

    const isAdmin = useSelector(({user}) => user.value.adminRoute) ? adminRoute : null;
    const showMobileMenu = isHamburgerClicked ? {style:{display: 'block'}} : {};

    return (
        <>
            <nav className="nav" {...showMobileMenu}>
                <ol className="nav-links">
                    <li className="nav-link" onClick={() => setIsHamburgerClicked(false)}>
                        <Link to="/panel" className="nav-link__link">
                            Panel
                        </Link>
                    </li>
                    <li className="nav-link" onClick={() => setIsHamburgerClicked(false)}>
                        <Link to="/panel/publications" className="nav-link__link">
                            Publikacje
                        </Link>
                    </li>
                    <li className="nav-link" onClick={() => setIsHamburgerClicked(false)}>
                        <Link to="/panel/settings" className="nav-link__link">
                            Ustawienia
                        </Link>
                    </li>
                    {isAdmin}
                    <li className="nav-link nav-link--logout">
                        <Link to="/login" className="nav-link__link " onClick={handleLogout}>
                            Wyloguj
                        </Link>
                    </li>
                </ol>
            </nav>
        </>
    );
};

export default Nav;
