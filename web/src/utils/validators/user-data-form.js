export const userRequiredDataValidation = (data) => {
    let valid = false;
    let errorMessage = '';
    if (data.firstName.length > 24) {
        errorMessage = 'Imię jest za długie!';
    } else if (data.secondName.length > 36) {
        errorMessage = 'Nazwisko jest za długie!';
    } else if (data.nick.length > 32) {
        errorMessage = 'Nick jest za długi!';
    } else if (data.title.length > 100) {
        errorMessage = 'Tytuł jest za długi!';
    } else {
        valid = true;
    }
    return {valid, errorMessage};
}

export const userOptionalDataValidation = (data) => {
    let valid = false;
    let errorMessage = '';
    if (data.province.length > 36) {
        errorMessage = 'Nazwa województwa jest za długa!';
    } else if (data.city.length > 50) {
        errorMessage = 'Nazwa miasta jest za długa!';
    } else if (data.phoneNumber.length > 10) {
        errorMessage = 'Numer telefonu jest za długi!';
    } else if (data.inpost.length !== 6 && data.inpost.length !== 0) {
        errorMessage = 'Numer paczkomatu jest nieprawidłowy!';
    } else {
        valid = true;
    }
    return {valid, errorMessage};
}

export const passwordValidation = (data) => {
    let valid = false;
    let errorMessage = '';
    const passReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if  (data.password1.length > 36) {
        errorMessage = 'Hasło jest za długie!';
    } else if (!data.password1.match(passReg)) {
        errorMessage = 'Wymagania: min. 8 znaków, min. 1 cyfra, min. 1 litera.';
    } else if (data.password1 !== data.password2) {
        errorMessage = 'Hasła nie są identyczne!';
    } else {
        valid = true;
    }
    return {valid, errorMessage};
}