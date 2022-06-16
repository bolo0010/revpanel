import '../../scss/addons/SearchBox.scss';

export const SearchBox = ({ searchCategory, suffix, handleCategorySearchChange, tableColumns }) => (
    <>
        <div className='search-box__container'>
            <label htmlFor={`${searchCategory}${suffix}`} className='search-select-label' />
            <select onChange={handleCategorySearchChange} id={`${searchCategory}${suffix}`}
                    value={searchCategory} className='search-box__select' name='table-search'>
                {tableColumns.map((column) => (
                    column.accessor !== 'actions' ?
                        <option key={column.Header} value={column.query}>
                            {column.Header}
                        </option> : null
                ))}
            </select>
        </div>
    </>
);