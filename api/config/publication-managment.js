const rolesCanArchiveInCorrection = ['3', '4'];
const rolesCanArchiveInPublish = ['4', '8', '9'];
const rolesCanReturnInCorrection = ['3', '4'];
const rolesCanReturnInPublish = ['4', '8', '9'];
const rolesCanCommentInCorrection = ['3', '4'];
const rolesCanCommentInPublish = ['4', '8', '9'];
const rolesCanCorrect = ['3', '4', '8', '9'];
const rolesCanPublish = ['4', '8', '9'];
const rolesCanSeeArchive = ['8', '9'];

const PUBLICATION_MAX_LENGTH = 5000;
const COMMENT_MAX_LENGTH = 1000;

module.exports = {
    rolesCanArchiveInCorrection,
    rolesCanArchiveInPublish,
    rolesCanReturnInCorrection,
    rolesCanReturnInPublish,
    rolesCanCommentInCorrection,
    rolesCanCommentInPublish,
    rolesCanCorrect,
    rolesCanPublish,
    rolesCanSeeArchive,
    PUBLICATION_MAX_LENGTH,
    COMMENT_MAX_LENGTH
}