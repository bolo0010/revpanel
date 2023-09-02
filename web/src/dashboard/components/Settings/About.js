import React from 'react';
import { useSelector } from 'react-redux';
import '../../scss/Settings/About.scss';

const About = ({ values }) => {
    const avatar = useSelector(({ user }) => user.value.avatar);

    return (
        <section className="about-me">
            <div className="about-me__avatar">
                <img src={avatar} alt="Avatar" className="avatar" />
            </div>
            <div className="about-me__title">
                <p className="nick">{values.nick}</p>
                <p className="role">{values.role}</p>
                <p className="title">{values.title}</p>
            </div>
        </section>
    );
};
export default About;
