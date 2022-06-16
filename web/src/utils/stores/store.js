import { configureStore } from '@reduxjs/toolkit';

import userReducer from './features/user/userSlice';
import loginReducer from './features/login/loginSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        login: loginReducer
    }
});

export default store;
