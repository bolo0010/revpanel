import axios from 'axios';

export const sendRegisterConfirmationEmail = async (user) => {
    try {
        await axios({
            method: 'POST',
            url: 'https://api.emailjs.com/api/v1.0/email/send',
            contentType: 'application/json',
            data: {
                service_id: 'gmail',
                template_id: 'some id',
                user_id: 'some id',
                accessToken: 'some token',
                template_params: { ...user }
            }
        });
    } catch (e) {
        console.error(e);
    }
};