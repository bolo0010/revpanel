import { SearchBox } from './SearchBox';
import '../../scss/addons/Search.scss';

export const Search = ({ searchCategory, handleCategorySearchChange, suffix, columns, inputs }) => (
    <div className='table-search'>
        <div className='search-box'>
            {inputs}
            <SearchBox
                searchCategory={searchCategory}
                handleCategorySearchChange={handleCategorySearchChange}
                suffix={suffix}
                tableColumns={columns}
            />
        </div>
    </div>
);