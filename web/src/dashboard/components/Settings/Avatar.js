import React, { useEffect, useState } from 'react';
import MainButton from '../addons/MainButton';
import { messageTimeout } from '../../config/messages';
import Message from '../addons/Message';
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../../scss/Settings/Avatar.scss';
import { MAX_FILE_SIZE, getUserAvatar } from '../../config/avatar';

const Avatar = () => {
    const avatar = useSelector(({ user }) => user.value.avatar);

    const [tempAvatar, setTempAvatar] = useState(null);
    const [fileName, setFileName] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [message, setMessage] = useState(null);
    const [isMessageVisible, setIsMessageVisible] = useState(false);

    useEffect(() => {
        if (!message) {
            setIsMessageVisible(false);
            return;
        }
        setIsMessageVisible(true);
        const timeout = setTimeout(() => {
            setIsMessageVisible(false);
        }, messageTimeout);
        return () => clearTimeout(timeout);
    }, [message]);

    useEffect(() => {
        if (!tempAvatar) {
            setAvatarPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(tempAvatar);
        setAvatarPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [tempAvatar]);

    const handleChange = (e) => {
        if (e.target.files.length < 1) return;
        if (e.target.files[0].size > MAX_FILE_SIZE) {
            setMessage(<Message message={'Rozmiar pliku jest za duży.'} />);
            setIsMessageVisible(true);
            return;
        }
        setTempAvatar(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!tempAvatar) {
            setMessage(<Message message={'Nie dodano pliku.'} />);
            setIsMessageVisible(true);
            return;
        }
        const formData = new FormData();
        formData.append('avatar', tempAvatar);
        formData.append('avatarName', tempAvatar.name);
        handleSubmitRequest(formData);
    };

    const handleSubmitRequest = async (formData) => {
        try {
            await axios({
                method: 'PATCH',
                url: '/api/users/avatar',
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formData
            });
            setMessage(<Message message={'Zdjęcie profilowe zostało zmienione.'} />);
            await getUserAvatar();
        } catch (error) {
            setMessage(<Message message={error.response.data.message} />);
        }
    };

    return (
        <section className="avatar-change">
            <h3 className="avatar-change__title">Zmień zdjęcie profilowe</h3>
            {isMessageVisible ? message : null}
            <form className="avatar-change__form" onSubmit={handleSubmit}>
                <div className="avatar-change__image">
                    <div className="avatar-change__image-container">
                        <img
                            src={avatarPreview ? avatarPreview : avatar}
                            alt="Zdjęcie profilowe"
                            className="avatar-change__avatar"
                        />
                    </div>
                    <div className="avatar-change__add">
                        <div className="avatar-change__add-container">
                            <label htmlFor="avatar-img-upload" className="avatar-change__add-btn">
                                <input
                                    id="avatar-img-upload"
                                    style={{ display: 'none' }}
                                    type="file"
                                    onChange={(e) => handleChange(e)}
                                    accept="image/png, image/jpeg, image/webp"
                                />
                                Dodaj
                            </label>
                            <span className="avatar-change__filename">{fileName}</span>
                        </div>
                        <p className="avatar-change__warning">
                            Maks. rozmiar: 2 MB, Dopuszczalne formaty: WEBP, PNG, JPEG
                        </p>
                    </div>
                </div>
                <div className="avatar-change__save-btn-container">
                    <MainButton onClick={() => {}} type="submit" value="Zapisz" />
                </div>
            </form>
        </section>
    );
};

export default Avatar;
