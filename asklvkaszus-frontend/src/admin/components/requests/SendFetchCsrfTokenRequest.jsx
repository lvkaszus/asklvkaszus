import axios from 'axios';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendFetchCsrfTokenRequest = async () => {
    try {
        const response = await axios.get(`${domain}/api/app/admin/fetch_csrf_token`);

        const csrfToken = response.data.csrf_token;

        return csrfToken;

    } catch (error) {
        console.error(`${t('admin-error-fetchcsrftoken')} ${error}`);
        
        throw error;
        
    }
};
