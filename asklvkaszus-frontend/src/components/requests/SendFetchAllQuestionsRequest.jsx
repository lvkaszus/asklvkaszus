import { useState, useCallback } from 'react';
import axios from 'axios';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendFetchAllQuestionsRequest = () => {
    const [isFetchAllQuestionsLoading, setFetchAllQuestionsLoading] = useState(true);
    const [fetchAllQuestionsResponse, setFetchAllQuestionsResponse] = useState('');
    const [fetchAllQuestionsError, setFetchAllQuestionsError] = useState(false);

    const handleFetchAllQuestionsRequest = useCallback(async () => {
        try {
            setFetchAllQuestionsLoading(true);

            const response = await axios.get(`${domain}/api/app/user/fetch_all_questions`);
            const jsonData = response.data;

            setFetchAllQuestionsResponse(jsonData);
            setFetchAllQuestionsError(false);
        } catch (error) {
            console.error('An error occurred while downloading the list of all messages!', error);

            setFetchAllQuestionsError(true);
            setFetchAllQuestionsResponse('');
        } finally {
            setFetchAllQuestionsLoading(false);
        }
    }, []);

    return {
        isFetchAllQuestionsLoading,
        fetchAllQuestionsResponse,
        fetchAllQuestionsError,
        handleFetchAllQuestionsRequest,
    };
};
