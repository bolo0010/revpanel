import axios from 'axios';
import { setAvatar } from '../../utils/stores/features/user/userSlice';
import store from '../../utils/stores/store';
export const MAX_FILE_SIZE = 2097152;
export const PATH_TO_IMAGE = 'http://localhost:5000/assets/img/';
// export const PATH_TO_IMAGE = 'https://panel.arturmaslowski.pl/assets/img/' //FIXME change on production

export const getUserAvatar = async () => {
    const avatar = await axios({
        method: 'GET',
        url: '/api/users/avatar',
        withCredentials: true
    });
    const name = avatar.data.name;
    const path = avatar.data.path;
    store.dispatch(setAvatar(path + name));
};
