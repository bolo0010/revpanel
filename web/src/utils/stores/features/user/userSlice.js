import { createSlice } from '@reduxjs/toolkit';

const initialState = { value: {} };

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.value = {...state.value, ...action.payload};
        },
        setAdminRoute: (state, action) => {
            state.value.adminRoute = action.payload;
        }
    }
});

export const { setUser, setAdminRoute} = userSlice.actions;
export default userSlice.reducer;
