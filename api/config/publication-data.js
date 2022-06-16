const basicDataShow = [
    'id',
    'title',
    'content',
    'createdAt',
    'updatedAt',
    'publishedAt',
    'isArchived'
];

const advancedDataShow = [
    ...basicDataShow,
    'id_author',
    'id_corrector',
    'id_publisher',
    'id_publications_types',
    'id_publications_states',
    'id_publications_routes'
];

module.exports = {
    basicDataShow,
    advancedDataShow
}