import { useState } from 'react';
import axios from 'axios';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';
import { useNavigate } from 'react-router-dom';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendFetchAllQuestionsRequest = () => {
    const [isFetchAllQuestionsLoading, setFetchAllQuestionsLoading] = useState(true);
    const [fetchAllQuestionsResponse, setFetchAllQuestionsResponse] = useState('');
    const [fetchAllQuestionsError, setFetchAllQuestionsError] = useState(false);

    const navigate = useNavigate();

    const submitFetchAllQuestionsRequest = async () => {
        try {
            const csrfToken = await SendFetchCsrfTokenRequest();

            const response = await axios.post(`${domain}/api/app/admin/fetch_all_questions`, {},
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
            if (error.response) {
                const { error: responseError } = error.response.data;
                
                if (
                    responseError.includes("Token") ||
                    responseError.includes("CSRF")
                ) {
                    setFetchAllQuestionsResponse('Please login again!');
                    setFetchAllQuestionsError(true);
                    setFetchAllQuestionsLoading(false);

                    navigate('/admin/login');
                } else {
                    setFetchAllQuestionsResponse(responseError);
                    setFetchAllQuestionsError(true);
                    setFetchAllQuestionsLoading(false);
                    
                }
      
              } else {
                setFetchAllQuestionsResponse('');
                setFetchAllQuestionsError(true);
                setFetchAllQuestionsLoading(false);

                console.error('An error occurred while sending a request to download questions list!', error);
              }
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