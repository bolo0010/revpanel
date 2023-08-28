import React from 'react';
import SelectForm from '../addons/SelectForm';
import ConfirmationButtons from '../addons/ConfirmationButtons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Message from '../addons/Message';
import '../../scss/Publications/PublishSelection.scss';

export const PublishSelection = ({ handleConfirmation, disablePublishPopout }) => {
    const [routes, setRoutes] = useState({});
    const [types, setTypes] = useState({});
    const [selectedRoute, setSelectedRoute] = useState(0);
    const [selectedType, setSelectedType] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [disableButtonOnError, setDisableButtonOnError] = useState(false);

    useEffect(() => {
        getRoutesAndTypes();
        setDisableButtonOnError(false);
    }, []);

    const getRoutesAndTypes = async () => {
        setIsLoading(true);
        try {
            const routes = await axios({
                method: 'GET',
                url: '/api/publications-routes',
                withCredentials: true
            });
            const types = await axios({
                method: 'GET',
                url: '/api/publications-types',
                withCredentials: true
            });
            if (routes.status === 200) {
                setRoutes(routes.data);
            }
            if (types.status === 200) {
                setTypes(types.data);
            }
        } catch (err) {
            setRoutes([
                {
                    id: '0',
                    message: 'Brak wyboru.'
                }
            ]);
            setTypes([
                {
                    id: '0',
                    message: 'Brak wyboru.'
                }
            ]);
            setErrorMessage('Wystąpił błąd! Proszę spróbować później.');
            setDisableButtonOnError(true);
        }
        setIsLoading(false);
    }

    const handleRoutesChange = (event) => {
        setSelectedRoute(event.target.value);
    };

    const handleTypesChange = (event) => {
        setSelectedType(event.target.value);
    };

    const errMessage = errorMessage ? <Message message={errorMessage} /> : null;

    if (isLoading) {
        return (
            <>
                <div className='publication-selection'>
                    <p>Ładowanie...</p>
                </div>
                <div className='publication-selection__background' />
            </>
        );
    }

    return (
        <>
            <div className='publication-selection'>
                <div className='publication-selection__title'>Wybierz miejsce publikacji</div>
                <form
                    onSubmit={(event) => handleConfirmation(event, selectedRoute, selectedType)}
                      className='publication-selection__form'
                >
                    {errMessage}
                    <SelectForm
                        label={'Ścieżka: '}
                        values={routes}
                        handleChange={handleRoutesChange}
                        selected={selectedRoute}
                        suffix={'_publication-selection'}
                        maxContainerWidth={true}
                    />
                    <SelectForm
                        label={'Typ publikacji: '}
                        values={types}
                        handleChange={handleTypesChange}
                        selected={selectedType}
                        suffix={'_publication-selection'}
                        maxContainerWidth={true}
                    />
                    <ConfirmationButtons
                        ok={'Publikuj'}
                        cancel={'Anuluj'}
                        type={'submit'}
                        handleConfirmation={disablePublishPopout}
                        isDisabled={disableButtonOnError}
                    />
                </form>
            </div>
            <div className='publication-selection__background' />
        </>
    );
};