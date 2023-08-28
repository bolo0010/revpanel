import React from 'react';
import InputForm from '../addons/InputForm';
import { adminSuffix, publicationSuffix } from '../../config/suffixes';
import { publicationSearchTypes } from '../../config/publication-search-types';

export const SearchInputs = ({ searchCategory, search, handleSearch }) => (
    <>
        {
            searchCategory === 'createdAt' ? (
                <>
                    <InputForm
                        inputOnChange={(event) => handleSearch(event, publicationSearchTypes.FROMDATE_CREATE)}
                        inputValue={search.fromDateCreate}
                        labelName='Od: '
                        inputName='search-from' inputType='date'
                        otherContainerClass='input-form-container--search'
                        suffix={adminSuffix}
                    />

                    <InputForm
                        inputOnChange={(event) => handleSearch(event, publicationSearchTypes.TODATE_CREATE)}
                        inputValue={search.toDateCreate}
                        labelName='Do: '
                        inputName='search-to' inputType='date'
                        otherContainerClass='input-form-container--search'
                        suffix={adminSuffix}
                    />
                </>
            ) : searchCategory === 'updatedAt' ? (
                <>
                    <InputForm
                        inputOnChange={(event) => handleSearch(event, publicationSearchTypes.FROMDATE_UPDATE)}
                        inputValue={search.fromDateUpdate}
                        labelName='Od: '
                        inputName='search-from' inputType='date'
                        otherContainerClass='input-form-container--search'
                        suffix={adminSuffix}
                    />

                    <InputForm
                        inputOnChange={(event) => handleSearch(event, publicationSearchTypes.TODATE_UPDATE)}
                        inputValue={search.toDateUpdate}
                        labelName='Do: '
                        inputName='search-to' inputType='date'
                        otherContainerClass='input-form-container--search'
                        suffix={adminSuffix}
                    />
                </>
            ) : searchCategory === 'publishedAt' ? (
                <>
                    <InputForm
                        inputOnChange={(event) => handleSearch(event, publicationSearchTypes.FROMDATE_PUBLISH)}
                        inputValue={search.fromDatePublish}
                        labelName='Od: '
                        inputName='search-from' inputType='date'
                        otherContainerClass='input-form-container--search'
                        suffix={adminSuffix}
                    />

                    <InputForm
                        inputOnChange={(event) => handleSearch(event, publicationSearchTypes.TODATE_PUBLISH)}
                        inputValue={search.toDatePublish}
                        labelName='Do: '
                        inputName='search-to' inputType='date'
                        otherContainerClass='input-form-container--search'
                        suffix={adminSuffix}
                    />
                </>
            ) : searchCategory === 'isArchived' ?
                (
                    <select
                        onChange={(event) => handleSearch(event, publicationSearchTypes.ISARCHIVED)}
                        id={`${searchCategory}${publicationSuffix}`}
                        value={search.active} className='search-box__select'
                        name='table-search'>
                        <option
                            key={`isArchived${publicationSuffix}-none`}
                            value={-1}>
                            Wybierz
                        </option>
                        <option
                            key={`isArchived${publicationSuffix}-false`}
                            value={0}>
                            Nie
                        </option>
                        <option
                            key={`isArchived${publicationSuffix}-true`}
                            value={1}>
                            Tak
                        </option>
                        ))
                    </select>
                ) : (
                <InputForm
                    inputOnChange={(event) => handleSearch(event, publicationSearchTypes.STANDARD)}
                    inputValue={search.value}
                    labelName='Szukaj:'
                    inputName='search' inputType='text'
                    otherContainerClass='input-form-container--search'
                    suffix={publicationSuffix}
                />
            )
        }
    </>
);