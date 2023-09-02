import { createSlice } from '@reduxjs/toolkit';
import { PATH_TO_IMAGE } from '../../../../dashboard/config/avatar';

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
        },
        setAvatar: (state, action) => {
            state.value.avatar = PATH_TO_IMAGE + action.payload;
        }
    }
});

export const { setUser, setAdminRoute, setAvatar } = userSlice.actions;

export default userSlice.reducer;
