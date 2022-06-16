import React, { useContext } from 'react';
import MainButton from '../addons/MainButton';
import {
    archiveButton,
    archiveStates,
    commentButton,
    returnButton,
    saveButton,
    sendButton
} from '../../../utils/validators/user-publication';
import { publicationContext } from './TextEditor';
import { nextPublicationStateButton } from '../../config/publication-managment';
import '../../scss/Publications/Buttons.scss';

const Buttons = () => {
    const {
        id_publications_states,
        author_id,
        user_role,
        user_id,
        corrector_id,
        isArchived,
        handleReturn,
        setShowAddCommentArea,
        handleArchivingOrDeleting,
        handleContentSave,
        handleSend,
        disablePopout
    } = useContext(publicationContext);

    const returnButtonType = () => {
        const option = returnButton(id_publications_states, author_id, user_role, user_id, corrector_id);

        if (option)
            return (
                <MainButton
                    value='Cofnij'
                    type='button'
                    onClick={handleReturn}
                />
            );
        else return null;
    };

    const commentButtonType = () => {
        const option = commentButton(id_publications_states, user_role, user_id, corrector_id);

        if (option)
            return (
                <MainButton
                    value='Skomentuj'
                    type='button'
                    onClick={() => setShowAddCommentArea(true)}
                />
            );
        else return null;
    };

    const archiveButtonType = () => {
        const option = archiveButton(
            id_publications_states,
            author_id,
            user_id,
            isArchived,
            user_role,
            corrector_id
        );

        switch (option) {
            case archiveStates.DELETE:
                return (
                    <MainButton
                        value='Usuń'
                        type='button'
                        onClick={handleArchivingOrDeleting}
                    />
                );
            case archiveStates.RESTORE:
                return (
                    <MainButton
                        value='Przywróć'
                        type='button'
                        onClick={handleArchivingOrDeleting}
                    />
                );
            case archiveStates.ARCHIVE:
                return (
                    <MainButton
                        value='Zarchiwizuj'
                        type='button'
                        onClick={handleArchivingOrDeleting}
                    />
                );
            default:
                return null;
        }
    };

    const saveButtonType = () => {
        const option = saveButton(id_publications_states, author_id, user_id);

        if (option)
            return (
                <MainButton
                    value='Zapisz'
                    type='button'
                    onClick={handleContentSave}
                />
            );
        else return null;
    };

    const sendButtonType = () => {
        const option = sendButton(id_publications_states, user_role, author_id, user_id, corrector_id);

        if (option)
            return (
                <MainButton
                    value={nextPublicationStateButton(id_publications_states)}
                    type='button'
                    onClick={handleSend}
                />
            );
        else return null;
    };

    return (
        <div className='TextEditor-buttons'>
            <div className='TextEditor-button__back'>
                <MainButton value='Anuluj' type='button' onClick={disablePopout}/>
            </div>
            <div className='TextEditor-button__return'>
                {returnButtonType()}
            </div>
            <div className='TextEditor-button__comment'>
                {commentButtonType()}
            </div>
            <div className='TextEditor-button__archive'>
                {archiveButtonType()}
            </div>
            <div className='TextEditor-button__save'>
                {saveButtonType()}
            </div>
            <div className='TextEditor-button__send'>
                {sendButtonType()}
            </div>
        </div>
    );
};

export default Buttons;