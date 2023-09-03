import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import header from '../img/header.svg';
import '../scss/Header.scss';

const Header = ({toggleMobileMenu, isHamburgerClicked}) => {
    const { nick } = useSelector(({user}) => user.value);
    const { role_pl } = useSelector(({user}) => user.value.role);
    const avatar = useSelector(({ user }) => user.value.avatar);

    return (
        <>
            <header className="header">
                <div className="header__logo">
                    <Link to="/panel">
                        <img src={header} alt="Logo" className="logo" />
                    </Link>
                </div>
                <div className="header__user-info">
                    <div className="user-info__avatar">
                        <img src={avatar} alt="Avatar" className="avatar" />
                    </div>
                    <div onClick={toggleMobileMenu}
                         className={isHamburgerClicked ? 'header__hamburger header__hamburger--rotate' : 'header__hamburger '}>
                        <i className="fa-solid fa-bars"/>
                    </div>
                    <div className="user-info__login-data">
                        <p className="nick">{nick}</p>
                        <p className="role">{role_pl}</p>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
