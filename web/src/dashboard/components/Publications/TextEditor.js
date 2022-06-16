import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { convertFromRaw, convertToRaw, EditorState, getDefaultKeyBinding, RichUtils } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createCounterPlugin from '@draft-js-plugins/counter';
import createStaticToolbarPlugin from '@draft-js-plugins/static-toolbar';
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
} from '@draft-js-plugins/buttons';
import Comments from './Comments';
import InputForm from '../addons/InputForm';
import axios from 'axios';
import Message from '../addons/Message';
import { useSelector } from 'react-redux';
import {
    nextPublicationStateMessage,
    previousPublicationStateMessage,
    PUBLICATION_MAX_LENGTH,
    rolesCanArchiveInCorrection,
    rolesCanArchiveInPublish,
    rolesCanPublish
} from '../../config/publication-managment';
import Confirmation from '../addons/Confirmation';
import AddComment from './AddComment';
import { messageTimeout } from '../../config/messages';
import { publicationStates } from '../../config/publication-states';
import '../../scss/Publications/TextEditor.scss';
import Buttons from './Buttons';
import { PublishSelection } from './PublishSelection';
import { adminSuffix } from '../../config/suffixes';
import '@draft-js-plugins/counter/lib/plugin.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';

export const publicationContext = createContext({});

const TextEditor = ({publication_id, disablePopout, refreshTable = () => {}}) => {
    //GET ACTUAL USER------------------------------------------------------------------------------
    const user = useSelector(({ user }) => user.value);

    //STATES---------------------------------------------------------------------------------------
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [publicationData, setPublicationData] = useState({
        id: '',
        title: 'Brak tytułu',
        createdAt: null,
        updatedAt: null,
        publishedAt: null,
        id_publications_types: null,
        id_publications_states: '0',
        id_publications_routes: null,
        isArchived: false,
        publications_comments: [],
        id_author: '',
        id_corrector: null,
        author: {},
        publisher: {},
        corrector: {}
    });
    const [message, setMessage] = useState(null);
    const [isMessageVisible, setIsMessageVisible] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddCommentArea, setShowAddCommentArea] = useState(false);
    const [confirmation, setConfirmation] = useState(null);
    const editor = useRef(null);

    //USE EFFECTS----------------------------------------------------------------------------------
    useEffect(() => {
        getPublication();
    }, []);

    useEffect(() => {
        if (!message) {
            setIsMessageVisible(false);
            return;
        }
        setIsMessageVisible(true);
        const timeout = setTimeout(() => {
            setIsMessageVisible(false);
        }, messageTimeout);
        return () => clearTimeout(timeout);
    }, [message]);

    //HANDLERS-------------------------------------------------------------------------------------
    const handleChange = (editorState) => {
        setEditorState(editorState);
    };

    const handleContentSave = () => {
        const currentContent = editorState.getCurrentContent();
        const contentRaw = convertToRaw(currentContent);
        savePublicationToDatabase(contentRaw, publicationData.title);
    };

    const handleReturn = () => {
        setConfirmation(
            <Confirmation
                message={`Czy chcesz ${previousPublicationStateMessage(publicationData.id_publications_states)}`}
                title={'Potwierdzenie'}
                handleConfirmation={(option) => handleStateRequest(
                    option,
                    true,
                    undefined,
                    publicationData.id_publications_states,
                    publicationData.id_author,
                    publicationData.id_corrector
                )}
            />
        );
    };

    const handleSend = () => {
        if (publicationData.id_publications_states === publicationStates.TO_PUBLISH
            && rolesCanPublish.includes(user.role.id)) {
            setConfirmation(<PublishSelection
                handleConfirmation={handlePublicationPublish}
                disablePublishPopout={disablePublishPopout} />);
            return;
        }
        setConfirmation(
            <Confirmation
                message={`Czy chcesz ${nextPublicationStateMessage(publicationData.id_publications_states)}`}
                title={'Potwierdzenie'}
                handleConfirmation={(option) => handleStateRequest(
                    option,
                    undefined,
                    true,
                    publicationData.id_publications_states,
                    publicationData.id_author,
                    publicationData.id_corrector
                )}
            />
        );
    };

    const handleArchivingOrDeleting = async () => {
        if (publicationData.id_publications_states !== publicationStates.DRAFT
            && (rolesCanArchiveInCorrection.includes(user.role.id)
                || rolesCanArchiveInPublish.includes(user.role.id))
            && !publicationData.isArchived)
            setConfirmation(
                <Confirmation
                    message={'Czy chcesz zarchiwizować tę publikację?'}
                    title={'Potwierdzenie'}
                    handleConfirmation={(option) => handleArchivingOrRestoringRequest(
                        option,
                        publicationData.id_publications_states,
                        publicationData.id_corrector,
                        false,
                        'Publikacja została zarchiwizowana.')}
                />
            );
        else if (rolesCanArchiveInCorrection.includes(user.role.id)
            || rolesCanArchiveInPublish.includes(user.role.id) && publicationData.isArchived)
            setConfirmation(
                <Confirmation
                    message={'Czy chcesz przywrócić tę publikację?'}
                    title={'Potwierdzenie'}
                    handleConfirmation={(option) => handleArchivingOrRestoringRequest(
                        option,
                        publicationData.id_publications_states,
                        publicationData.id_corrector,
                        true,
                        'Publikacja została przywrócona.')}
                />
            );
        else
            setConfirmation(
                <Confirmation
                    message={'Czy chcesz usunąć tę publikację?'}
                    title={'Potwierdzenie'}
                    handleConfirmation={(option) => handleDeletingRequest(
                        option
                    )}
                />
            );
    };

    const handlePublicationPublish = (event, selectedRoute, selectedType) => {
        event.preventDefault();
        setConfirmation(null);

        handlePublicationPublishRequest(
            publicationData.id_publications_states,
            true,
            selectedRoute,
            selectedType
        );
    };

    const disablePublishPopout = (option) => {
        if (!option) setConfirmation(null);

    };

    //REQUESTS-------------------------------------------------------------------------------------
    const getPublication = async () => {
        setIsLoading(true);
        try {
            const res = await axios({
                method: 'GET',
                url: `/api/publications/${publication_id}`,
                withCredentials: true
            });
            if (res.data.content) {
                const content = EditorState.createWithContent(convertFromRaw(JSON.parse(res.data.content)));
                setEditorState(content);
            }
            setPublicationData({
                id: res.data.id,
                title: res.data.title,
                createdAt: res.data.createdAt,
                updatedAt: res.data.updatedAt,
                publishedAt: res.data.publishedAt,
                id_publications_types: res.data.id_publications_types,
                id_publications_states: res.data.id_publications_states,
                id_publications_routes: res.data.id_publications_routes,
                isArchived: res.data.isArchived,
                publications_comments: res.data.publications_comments,
                id_author: res.data.id_author,
                id_corrector: res.data.id_corrector,
                author: res.data.author,
                publisher: res.data.publisher,
                corrector: res.data.corrector
            });
        } catch (err) {
            //TODO zrobić error
        }
        setIsLoading(false);
    };

    const handleStateRequest = async (
        option,
        previous_state,
        next_state,
        id_publications_states,
        author_id,
        corrector_id
    ) => {
        setConfirmation(null);
        if (!option) return;


        try {
            const res = await axios({
                method: 'PATCH',
                url: `/api/publications/${publication_id}`,
                withCredentials: true,
                data: {
                    previous_state,
                    next_state,
                    id_publications_states,
                    author_id,
                    corrector_id
                }
            });
            if (res.status === 200) {
                setMessage(<Message message={res.data.message} />);
                getPublication();
                refreshTable();
            }
        } catch (error) {
            setMessage(<Message message={error.response.data.message} />);
        }
    };

    const savePublicationToDatabase = async (content, title) => {
        try {
            const res = await axios({
                method: 'PATCH',
                url: `/api/publications/${publication_id}`,
                withCredentials: true,
                data: {
                    content,
                    title
                }
            });
            if (res.status === 200) {
                setMessage(<Message message={res.data.message} />);
                refreshTable();
            }
        } catch (error) {
            setMessage(<Message message={error.response.data.message} />);
        }
    };

    const handleArchivingOrRestoringRequest = async (
        option,
        id_publications_states,
        corrector_id,
        isArchived,
        message
    ) => {
        setConfirmation(null);
        if (!option) return;

        try {
            const res = await axios({
                method: 'PATCH',
                url: `/api/publications/${publication_id}`,
                withCredentials: true,
                data: {
                    isArchived,
                    id_publications_states,
                    corrector_id
                }
            });
            if (res.status === 200) {
                setMessage(<Message message={message} />);
                getPublication();
                refreshTable();
            }
        } catch (error) {
            setMessage(<Message message={error.response.data.message} />);
        }
    };

    const handleDeletingRequest = async (option) => {
        setConfirmation(null);
        if (!option) return;

        try {
            const res = await axios({
                method: 'DELETE',
                url: `/api/publications`,
                withCredentials: true,
                data: {
                    id_publications_states: publicationData.id_publications_states,
                    id_author: publicationData.id_author,
                    id: publicationData.id
                }
            });
            if (res.status === 200) {
                refreshTable();
                disablePopout();
            }
        } catch (error) {
            setMessage(<Message message={error.response.data.message} />);
        }
    };

    const handlePublicationPublishRequest = async (
        id_publications_states,
        next_state,
        id_publications_routes,
        id_publications_types
    ) => {

        try {
            const res = await axios({
                method: 'PATCH',
                url: `/api/publications/${publication_id}`,
                withCredentials: true,
                data: {
                    id_publications_states,
                    next_state,
                    id_publications_routes,
                    id_publications_types
                }
            });
            if (res.status === 200) {
                getPublication();
                refreshTable();
            }
        } catch (error) {
            setMessage(<Message message={error.response.data.message} />);
        }
    };


    //EDITOR OPTIONS-------------------------------------------------------------------------------
    const focus = () => {
        if (editor.current) editor.current.focus();
    };

    const mapKeyToEditorCommand = useCallback(
        e => {
            switch (e.keyCode) {
                case 9:
                    const newEditorState = RichUtils.onTab(
                        e,
                        editorState,
                        4
                    );
                    if (newEditorState !== editorState) {
                        setEditorState(newEditorState);
                    }
                    return null;
            }
            return getDefaultKeyBinding(e);
        },
        [editorState, setEditorState]
    );

    let className = 'TextEditor-editor';
    let contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
        if (
            contentState
                .getBlockMap()
                .first()
                .getType() !== 'unstyled'
        ) {
            className += ' TextEditor-hidePlaceholder';
        }
    }

    const handleKeyCommand = useCallback(
        (command, editorState) => {
            const newState = RichUtils.handleKeyCommand(editorState, command);
            if (newState) {
                setEditorState(newState);
                return 'handled';
            }
            return 'not-handled';
        },
        [editorState, setEditorState]
    );

    //RENDER---------------------------------------------------------------------------------------
    if (isLoading) {
        return (
            <>
                <div className='TextEditor-root'>
                    <p>Ładowanie...</p>
                </div>
                <div className='TextEditor-background' />
            </>
        );
    }

    return (
        <>
            {confirmation}
            <div className='TextEditor-root'>
                {isMessageVisible ? message : null}
                <div className='TextEditor-header'>
                    <InputForm
                        inputRequired={true}
                        inputType={'text'}
                        inputValue={publicationData.title}
                        inputName={'title'}
                        labelName={'Tytuł'}
                        inputOnChange={(e) =>
                            setPublicationData(values => ({ ...values, title: e.target.value }))}
                        suffix={adminSuffix}
                    />
                    <InputForm
                        inputRequired={true}
                        inputType={'text'}
                        inputValue={publicationData.author.nick}
                        inputName={'author'}
                        labelName={'Autor'}
                        inputDisabled={true}
                        suffix={adminSuffix}
                    />
                </div>
                <div className='TextEditor-controls-panel'>
                    <Toolbar>
                        {
                            (externalProps) => (
                                <div>
                                    <BoldButton {...externalProps} />
                                    <ItalicButton {...externalProps} />
                                    <UnderlineButton {...externalProps} />
                                    <UnorderedListButton {...externalProps} />
                                    <OrderedListButton {...externalProps} />
                                    <BlockquoteButton {...externalProps} />
                                </div>
                            )
                        }
                    </Toolbar>
                </div>
                <div className={className} onClick={focus}>
                    {!editorState && <div>Ładowanie...</div>}
                    <Editor
                        blockStyleFn={getBlockStyle}
                        editorState={editorState}
                        onChange={handleChange}
                        handleKeyCommand={handleKeyCommand}
                        keyBindingFn={mapKeyToEditorCommand}
                        placeholder='Napisz coś...'
                        ref={(editor) => editor}
                        spellCheck={true}
                        plugins={plugins}
                    />
                </div>
                <div className='TextEditor-counter-box'>
                    <CustomCounter countFunction={customCountFunction} editorState={editorState}
                                   limit={PUBLICATION_MAX_LENGTH - 1} />
                    <span className='TextEditor-counter'>/ {PUBLICATION_MAX_LENGTH}</span>
                </div>
                <Comments setConfirmation={setConfirmation}
                          refreshPublication={getPublication}
                          comments={publicationData.publications_comments}
                />
                {showAddCommentArea ?
                    <AddComment setShowAddCommentArea={setShowAddCommentArea}
                                id_publication={publicationData.id}
                                id_publications_states={publicationData.id_publications_states}
                                corrector_id={publicationData.id_corrector}
                                setConfirmation={setConfirmation}
                                setMessage={setMessage}
                                refreshPublication={getPublication}
                    /> : null}
                <publicationContext.Provider value={{
                    user_id: user.id,
                    user_role: user.role.id,
                    id_publications_states: publicationData.id_publications_states,
                    author_id: publicationData.id_author,
                    isArchived: publicationData.isArchived,
                    corrector_id: publicationData.id_corrector,
                    handleReturn,
                    setShowAddCommentArea,
                    handleArchivingOrDeleting,
                    handleContentSave,
                    handleSend,
                    disablePopout: disablePopout
                }}>
                    <Buttons />
                </publicationContext.Provider>
            </div>
            <div className='TextEditor-background' />
        </>
    );
};

//EDITOR ADDONS OPTIONS----------------------------------------------------------------------------
const theme = {
    counter: 'TextEditor-counter',
    counterOverLimit: 'TextEditor-counter-over-limit'
};

const counterPlugin = createCounterPlugin({ theme });
const staticToolbarPlugin = createStaticToolbarPlugin();
const { CustomCounter } = counterPlugin;
const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin, counterPlugin];

const customCountFunction = (text) => {
    const withoutEnters = text.match(/./g);
    return withoutEnters ? withoutEnters.length : 0;
};

const getBlockStyle = (block) => {
    switch (block.getType()) {
        case 'blockquote':
            return 'TextEditor-blockquote';
        default:
            return null;
    }
};

export default TextEditor;