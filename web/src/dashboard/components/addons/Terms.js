import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../scss/addons/Terms.scss';

const Terms = () => {
    const [terms, setTerms] = useState({
        text: "",
        link: "",
        name: "",
    });

    useEffect(() => {
        getTerms();
    }, []);


    const getTerms = async () => {
        try {
            const res = await axios({
                method: 'GET',
                url: '/api/terms',
                withCredentials: true
            });
            if (res.status === 200) {
                setTerms(res.data);
            }
        } catch (err) {
            console.error(err); //TODO obsłużyć błąd
        }
    };

    const {text, link, name} = terms;
    return (
        <p className='terms'>
            <span className='terms__text'>{text}</span>
            <a href={link} target='_blank' className='terms__link'>
                {name}
            </a>
        </p>
    );
};

export default Terms;
