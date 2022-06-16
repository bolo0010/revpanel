import InputForm from '../addons/InputForm';
import { adminSearchTypes } from '../../config/admin-search-types';
import { adminSuffix } from '../../config/suffixes';

export const SearchInputs = ({ searchCategory, search, handleSearch }) => (
    <>
        {
            searchCategory === 'dateOfBirth' ? (
                <>
                    <InputForm
                        inputOnChange={(event) => handleSearch(event, adminSearchTypes.FROMDATE)}
                        inputValue={search.fromDate}
                        labelName='Od: '
                        inputName='search-from' inputType='date'
                        otherContainerClass='input-form-container--search'
                        suffix={adminSuffix}
                    />

                    <InputForm
                        inputOnChange={(event) => handleSearch(event, adminSearchTypes.TODATE)}
                        inputValue={search.toDate}
                        labelName='Do: '
                        inputName='search-to' inputType='date'
                        otherContainerClass='input-form-container--search'
                        suffix={adminSuffix}
                    />
                </>
            ) : searchCategory === 'isActive' ?
                (
                    <select
                        onChange={(event) => handleSearch(event, adminSearchTypes.ISACTIVE)}
                        id={`${searchCategory}${adminSuffix}`}
                        value={search.active} className='search-box__select'
                        name='table-search'>
                        <option
                            key={`isActive${adminSuffix}-none`}
                            value={-1}>
                            Wybierz
                        </option>
                        <option
                            key={`isActive${adminSuffix}-false`}
                            value={0}>
                            Nieaktywne
                        </option>
                        <option
                            key={`isActive${adminSuffix}-true`}
                            value={1}>
                            Aktywne
                        </option>
                        ))}
                    </select>
                ) : searchCategory === 'isTermsAccepted' ?
                    (
                        <select
                            onChange={(event) => handleSearch(event, adminSearchTypes.ISTERMSACCEPTED)}
                            id={`${searchCategory}${adminSuffix}`}
                            value={search.terms} className='search-box__select'
                            name='table-search'>
                            <option
                                key={`isTermsAccepted${adminSuffix}-none`}
                                value={-1}>
                                Wybierz
                            </option>
                            <option
                                key={`isTermsAccepted${adminSuffix}-false`}
                                value={0}>
                                Nie zaakceptowano
                            </option>
                            <option
                                key={`isTermsAccepted${adminSuffix}-true`}
                                value={1}>
                                Zaakceptowano
                            </option>
                            ))}
                        </select>
                    ) :
                    (
                        <InputForm
                            inputOnChange={(event) => handleSearch(event, adminSearchTypes.STANDARD)}
                            inputValue={search.value}
                            labelName='Szukaj:'
                            inputName='search' inputType='text'
                            otherContainerClass='input-form-container--search'
                            suffix={adminSuffix}

                        />
                    )
        }
    </>
);