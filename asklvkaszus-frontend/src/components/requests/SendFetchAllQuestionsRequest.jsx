import { useState } from 'react';
import axios from 'axios';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendFetchAllQuestionsRequest = () => {
    const [isFetchAllQuestionsLoading, setFetchAllQuestionsLoading] = useState(true);
    const [fetchAllQuestionsResponse, setFetchAllQuestionsResponse] = useState('');
    const [fetchAllQuestionsError, setFetchAllQuestionsError] = useState(false);

    const submitFetchAllQuestionsRequest = async () => {
        try {
            const csrfToken = await SendFetchCsrfTokenRequest();

            const response = await axios.post(`${domain}/api/app/user/fetch_all_questions`, {},
                {
                    headers: {
                    'X-CSRFToken': csrfToken
                    }
                }
            );
            
            const jsonData = response.data;

            setFetchAllQuestionsResponse(jsonData);
            setFetchAllQuestionsError(false);
            setFetchAllQuestionsLoading(false);

        } catch (error) {

            console.error('An error occurred while downloading the list of all messages!', error);

            setFetchAllQuestionsError(true);
            setFetchAllQuestionsResponse('');
            setFetchAllQuestionsLoading(false);

        }
    };

    const handleFetchAllQuestionsRequest = async () => {
        await submitFetchAllQuestionsRequest();
    };

    return {
        isFetchAllQuestionsLoading,
        fetchAllQuestionsResponse,
        fetchAllQuestionsError,
        handleFetchAllQuestionsRequest,
    };
};