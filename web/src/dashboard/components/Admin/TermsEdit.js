import React from 'react';
import { useEffect, useState } from 'react';
import InputForm from '../addons/InputForm';
import ConfirmationButtons from '../addons/ConfirmationButtons';
import TextArea from '../addons/TextArea';
import axios from 'axios';
import { adminSuffix } from '../../config/suffixes';
import '../../scss/Admin/TermsEdit.scss';

const TermsEdit = ({ setChangeTermsForm }) => {
    const [terms, setTerms] = useState({
        text: '',
        link: '',
        name: ''
    });

    const [isLoading, setIsLoading] = useState(true);

    const set = (name) => {
        return ({ target: { value } }) => {
            setTerms((oldValues) => ({
                ...oldValues,
                [name]: value
            }));
        };
    };

    const getTerms = async () => {
        setIsLoading(true);
        try {
            const res = await axios({
                method: 'GET',
                url: '/api/terms',
                withCredentials: true
            });
            if (res.status === 200) {
                setTerms({
                    text: res.data.text,
                    link: res.data.link,
                    name: res.data.name
                });
                setIsLoading(false);
            }
        } catch (err) {
            setIsLoading(true);
        }
    };

    const patchTerms = async () => {
        try {
            await axios({
                method: 'PATCH',
                url: '/api/terms',
                withCredentials: true,
                data: terms
            });
        } catch (err) {
            //TODO zrobić errora
        }
    };

    useEffect(() => {
        getTerms();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        patchTerms();
        setChangeTermsForm(null);
    };

    const disablePopUp = (option) => {
        if (!option) setChangeTermsForm(null);
    };

    if (isLoading) {
        return (
            <>
                <div className="terms-edit">
                    <p>Ładowanie...</p>
                </div>
                <div className="terms-edit__background" />
            </>
        );
    }

    return (
        <>
            <div className='terms-edit'>
                <div className='terms-edit__title'>Edycja komunikatu</div>
                <form onSubmit={handleSubmit} className='terms-edit__form'>
                    <TextArea
                        textAreaName={'Treść komunikatu'}
                        textAreaRows={5}
                        textAreaColumns={20}
                        textAreaValue={terms.text}
                        textAreaOnChange={set('text')}
                        textAreaRequired={'true'}
                    />
                    <InputForm
                        labelName={'Link do regulaminu'}
                        inputName={'link'}
                        inputType={'url'}
                        inputValue={terms.link}
                        inputOnChange={set('link')}
                        inputRequired={'true'}
                        otherContainerClass={'input-form-container--terms'}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        labelName={'Nazwa linku'}
                        inputName={'name'}
                        inputType={'text'}
                        inputValue={terms.name}
                        inputOnChange={set('name')}
                        inputRequired={'true'}
                        otherContainerClass={'input-form-container--terms'}
                        suffix={adminSuffix}
                    />
                    <ConfirmationButtons
                        handleConfirmation={disablePopUp}
                        type={'submit'}
                        cancel={'Anuluj'}
                        ok={'Zatwierdź'} />
                </form>
            </div>
            <div className='terms-edit__background' />
        </>
    );
};

export default TermsEdit;