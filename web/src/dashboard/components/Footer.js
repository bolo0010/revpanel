import '../scss/Footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <p className="footer-element">
                Panel administracyjny |
                <a className="footer__rules" href="#">
                    Regulamin
                </a>
                | it@example.pl
            </p>
        </footer>
    );
};

export default Footer;
