import React from 'react';
import '../../scss/addons/Message.scss';

const Message = ({ message }) => {
    return (
        <div className="change-message">
            <p className="change-message__text">{message}</p>
        </div>
    );
};

export default Message;
