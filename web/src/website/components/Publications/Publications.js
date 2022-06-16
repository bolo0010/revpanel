import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Publication } from './Publication';
import "../../scss/Publications/Publications.scss"


export const Publications = ({ route }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [publications, setPublications] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        getPublications();
    }, []);

    const getPublications = async () => {
        setIsLoading(true);
        try {
            const res = await axios({
                method: 'GET',
                url: `/api/publications/public/${route}`
            });
            setPublications(res.data);
        } catch (error) {
            setErrorMessage(error.response.data.message);
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <p className='publications-loading'>
                <span className='publications-loading__message'>Ładowanie zawartości...</span>
            </p>
        );
    }

    return (
        <>
            <div className='publications'>
                {
                    errorMessage ?
                        <div className='publications-error'>
                            <span className='publications-error__message'>{errorMessage}</span>
                        </div>
                        : null
                }
                {publications.map(publication => <Publication
                    content={publication.content}
                    title={publication.title}
                    author={
                        `${publication.author.firstName} 
                        "${publication.author.nick}" 
                        ${publication.author.secondName}`}
                    date={publication.publishedAt}
                    type={publication.publications_type.type_pl}
                    key={publication.id}
                />)}
            </div>
        </>
    );
};