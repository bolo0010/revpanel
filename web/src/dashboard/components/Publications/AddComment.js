import React, { useState } from 'react';
import TextArea from '../addons/TextArea';
import axios from 'axios';
import Message from '../addons/Message';
import { COMMENT_MAX_LENGTH } from '../../config/publication-managment';
import '../../scss/Publications/AddComment.scss';

const AddComment = ({
                        id_publication,
                        setShowAddCommentArea,
                        setMessage,
                        refreshPublication,
                        id_publications_states,
                        id_corrector
                    }) => {
    const [comment, setComment] = useState('');
    const [charCounter, setCharCounter] = useState(0);

    const onChangeComment = (e) => {
        setCharCounter(e.target.value.length);
        setComment(e.target.value);
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        try {
            const res = await axios({
                method: 'POST',
                url: '/api/publications-comments/',
                withCredentials: true,
                data: {
                    comment,
                    id_publication,
                    id_publications_states,
                    id_corrector
                }
            });
            if (res.status === 200) {
                setMessage(<Message message={res.data.message} />);
                refreshPublication();
                setShowAddCommentArea(false);
            }
        } catch (error) {
            setMessage(<Message message={error.response.data.message} />);
        }
    };

    return (
        <div className='comment-add'>
            <form onSubmit={(e) => handleSubmitRequest(e)} className='comment-add__form'>
                <TextArea
                    textAreaName={'Treść komentarza'}
                    textAreaRows={20}
                    textAreaColumns={20}
                    textAreaValue={comment}
                    textAreaOnChange={(e) => onChangeComment(e)}
                    textAreaRequired={'true'}
                />
                <div className='comment-add__counter'>
                    <span
                        className='comment-add__length ' {...charCounter >= COMMENT_MAX_LENGTH ? { className: 'comment-add__counter--max comment-add__length' } : {}}>{charCounter}</span><span
                    className='comment-add__length'> / {COMMENT_MAX_LENGTH}</span>
                </div>
                <button type='submit' onClick={() => {
                }} className='comment-add__button'>Dodaj
                </button>
                <button type='button' onClick={() => setShowAddCommentArea(false)}
                        className='comment-add__button'>Anuluj
                </button>
            </form>
        </div>
    );
};

export default AddComment;