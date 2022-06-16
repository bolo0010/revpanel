import React, { useState } from 'react';
import Confirmation from '../addons/Confirmation';
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../../scss/Publications/Comment.scss';

const Comment = ({ nick, role, content, date, id, setConfirmation, refreshPublication, user_id }) => {
    const { id: actual_user_id} = useSelector(({ user }) => user.value);
    const [message, setMessage] = useState(null);

    const handleDeleteComment = () => {
        setConfirmation(
            <Confirmation
                message={'Czy chcesz usunąć ten komentarz?'}
                title={'Potwierdzenie'}
                handleConfirmation={handleDeleteCommentRequest}
            />
        );
    };

    const handleDeleteCommentRequest = async (option) => {
        setMessage(null);
        setConfirmation(null);
        if (!option) return;

        try {
            await axios({
                method: 'DELETE',
                url: `/api/publications-comments/`,
                withCredentials: true,
                data: {
                    id,
                    id_author: user_id
                }
            });
            refreshPublication();
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div className='TextEditor-comment'>
            <div className='TextEditor-comment__header'>
                <span className='TextEditor-comment__author'>{date} - {nick} ({role}):</span>
                <div className='TextEditor-comment__buttons'>
                    {actual_user_id === user_id
                        ? <a href='#' onClick={handleDeleteComment} className='TextEditor-comment__button'>Usuń</a>
                        : null
                    }
                </div>
            </div>
            <p className='TextEditor-comment__content'>
                {message ? <p className='TextEditor-comment__content--error'>{message}</p>  : content}
            </p>
        </div>
    );
};

export default Comment;