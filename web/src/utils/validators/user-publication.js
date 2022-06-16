import {
    rolesCanArchiveInCorrection,
    rolesCanArchiveInPublish,
    rolesCanCommentInPublish,
    rolesCanCorrect,
    rolesCanPublish,
    rolesCanReturnInCorrection,
    rolesCanReturnInPublish
} from '../../dashboard/config/publication-managment';
import { publicationStates } from '../../dashboard/config/publication-states';

export const archiveStates = {
    DELETE: 0,
    RESTORE: 1,
    ARCHIVE: 2
};

export const returnButton = (id_publications_states, author_id, user_role, user_id, corrector_id) => {
    //(KOREKTOR | MODERATOR) W TRAKCIE KOREKTY
    if (id_publications_states === publicationStates.IN_CORRECTION
        && rolesCanReturnInCorrection.includes(user_role)
        && corrector_id === user_id)
        return true;

    //(ADMINISTRATOR | GŁÓWNY ADMINISTRATOR) W TRAKCIE KOREKTY
    if (id_publications_states === publicationStates.IN_CORRECTION
        && rolesCanReturnInPublish.includes(user_role)
        && corrector_id === user_id)
        return true;

    //(ADMINISTRATOR | GŁÓWNY ADMINISTRATOR) W TRAKCIE PUBLIKACJI I PO OPUBLIKOWANIU
    if ((id_publications_states === publicationStates.TO_PUBLISH
            || id_publications_states === publicationStates.PUBLISHED)
        && rolesCanReturnInPublish.includes(user_role))
        return true;

    //(AUTOR PUBLIKACJI) PRZED KOREKTĄ
    else if (id_publications_states === publicationStates.FOR_CORRECTION
        && user_id === author_id)
        return true;

    return false;
};

export const commentButton = (id_publications_states, user_role, user_id, corrector_id) => {
    //(KOREKTOR | MODERATOR) W TRAKCIE KOREKTY
    if (id_publications_states === publicationStates.IN_CORRECTION
        && rolesCanReturnInCorrection.includes(user_role)
        && corrector_id === user_id)
        return true;

    //(ADMINISTRATOR | GŁÓWNY ADMINISTRATOR) W TRAKCIE KOREKTY
    if (id_publications_states === publicationStates.IN_CORRECTION
        && rolesCanReturnInPublish.includes(user_role)
        && corrector_id === user_id)
        return true;

    //(ADMINISTRATOR | GŁÓWNY ADMINISTRATOR) W TRAKCIE PUBLIKACJI
    if (id_publications_states === publicationStates.TO_PUBLISH
        && rolesCanCommentInPublish.includes(user_role))
        return true;

    return false;
};

export const saveButton = (id_publications_states, author_id, user_id) => {
    //TYLKO (AUTOR PUBLIKACJI)
    return id_publications_states === publicationStates.DRAFT && user_id === author_id;
};

export const archiveButton = (
    id_publications_states,
    author_id,
    user_id,
    isArchived,
    user_role,
    corrector_id
) => {
    //TYLKO (AUTOR PUBLIKACJI)
    if (id_publications_states === publicationStates.DRAFT && author_id === user_id)
        return archiveStates.DELETE;
    //TYLKO (ADMINISTRATOR | GŁÓWNY ADMINISTRATOR)
    if (isArchived && rolesCanArchiveInPublish.includes(user_role))
        return archiveStates.RESTORE;
    if (!isArchived) {
        //(KOREKTOR | MODERATOR) W TRAKCIE KOREKTY
        if (id_publications_states === publicationStates.IN_CORRECTION
            && rolesCanArchiveInCorrection.includes(user_role)
            && corrector_id === user_id)
            return archiveStates.ARCHIVE;
        //(ADMINISTRATOR | GŁÓWNY ADMINISTRATOR) W TRAKCIE KOREKTY
        if (id_publications_states === publicationStates.IN_CORRECTION
            && rolesCanArchiveInPublish.includes(user_role)
            && corrector_id === user_id)
            return archiveStates.ARCHIVE;
        //(ADMINISTRATOR | GŁÓWNY ADMINISTRATOR) W TRAKCIE PUBLIKACJI I PO PUBLIKACJI
        if ((id_publications_states === publicationStates.TO_PUBLISH
                || id_publications_states === publicationStates.PUBLISHED)
            && rolesCanArchiveInPublish.includes(user_role))
            return archiveStates.ARCHIVE;
    }
    return null;
};

export const sendButton = (id_publications_states, user_role, author_id, user_id, corrector_id) => {
    //(AUTOR PUBLIKACJI) W WERSJI ROBOCZEJ
    if (id_publications_states === publicationStates.DRAFT && user_id === author_id)
        return true;
    //(KOREKTOR | MODERATOR) PRZED KOREKTĄ
    if (id_publications_states === publicationStates.FOR_CORRECTION
        && rolesCanCorrect.includes(user_role)
        && (corrector_id !== null ? corrector_id === user_id : true))
        return true;
    //(KOREKTOR | MODERATOR) W TRAKCIE KOREKTY
    if (id_publications_states === publicationStates.IN_CORRECTION
        && rolesCanCorrect.includes(user_role)
        && corrector_id === user_id)
        return true;
    //(ADMINISTRATOR | GŁÓWNY ADMINISTRATOR) W TRAKCIE PUBLIKACJI
    if (id_publications_states === publicationStates.TO_PUBLISH && rolesCanPublish.includes(user_role))
        return true;
    return false;
};