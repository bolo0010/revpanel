import { createSlice } from '@reduxjs/toolkit';

const initialState = { value: {
        errorMessage: null,
        isValid: true
    } };

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setErrorMessage: (state, action) => {
            state.value.errorMessage = action.payload;
        },
        setIsValid: (state, action) => {
            state.value.isValid = action.payload;
        },
    }
});

export const { setErrorMessage, setIsValid } = loginSlice.actions;
export default loginSlice.reducer;
