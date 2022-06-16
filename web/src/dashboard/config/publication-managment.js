import { publicationStates } from './publication-states';

export const rolesCanArchiveInCorrection = ['3', '4']
export const rolesCanArchiveInPublish = ['4', '8', '9']
export const rolesCanReturnInCorrection = ['3', '4'];
export const rolesCanReturnInPublish = ['4', '8', '9'];
export const rolesCanCommentInCorrection = ['3', '4'];
export const rolesCanCommentInPublish = ['4', '8', '9'];
export const rolesCanCorrect = ['3', '4', '8', '9'];
export const rolesCanPublish = ['4', '8', '9'];
export const rolesCanSeeArchive = ['8', '9']

export const PUBLICATION_MAX_LENGTH = 5000
export const COMMENT_MAX_LENGTH = 1000

export const previousPublicationStateMessage = (state) => {
    switch (state) {
        case publicationStates.PUBLISHED:
            return ' zaprzestać publikowania?';
        case publicationStates.TO_PUBLISH:
            return ' cofnąć tę publikację do korekty?';
        case publicationStates.IN_CORRECTION:
            return ' wycofać tę publikację do ponownej edycji?';
        case publicationStates.FOR_CORRECTION:
            return ' wycofać do edycji?';
        default:
            return ' nic nie robić?';
    }
};

export const nextPublicationStateMessage = (state) => {
    switch (state) {
        case publicationStates.DRAFT:
            return ' wysłać tę publikację do korekty?';
        case publicationStates.FOR_CORRECTION:
            return ' rozpocząć korektę tej publikacji?';
        case publicationStates.IN_CORRECTION:
            return ' oznaczyć tę publikację jako gotową do publikacji?';
        case publicationStates.TO_PUBLISH:
            return ' opublikować tę publikację?';
        default:
            return ' nic nie robić?';
    }
};

export const nextPublicationStateButton = (state) => {
    switch (state) {
        case publicationStates.DRAFT:
            return 'Wyślij';
        case publicationStates.FOR_CORRECTION:
            return 'Rozpocznij korektę';
        case publicationStates.IN_CORRECTION:
            return 'Do publikacji';
        case publicationStates.TO_PUBLISH:
            return 'Opublikuj';
        default:
            return 'Nic';
    }
};