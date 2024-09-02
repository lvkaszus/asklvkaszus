import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendSubmitQuestionRequest = (question) => {
    const { t } = useTranslation();

    const [submitQuestionResponse, setSubmitQuestionResponse] = useState('');
    const [submitQuestionError, setSubmitQuestionError] = useState(false);

    const submitQuestionRequest = async () => {
        try {
            const csrfToken = await SendFetchCsrfTokenRequest();

            const response = await axios.post(`${domain}/api/app/user/submit_question`,
                { question: question },

                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                    },
                }
            );
          
            const { success } = response.data;

            setSubmitQuestionResponse(success);
            setSubmitQuestionError(false);

        } catch (error) {
            if (error.response) {
                const { error: responseError } = error.response.data;

                setSubmitQuestionResponse(responseError);
                setSubmitQuestionError(true);

            } else {
                console.error(`${t('error-submitquestion')} ${error}`);

                setSubmitQuestionResponse('');
                setSubmitQuestionError(true);

            }
        }
    };

    const handleSubmitQuestionRequest = async () => {
        await submitQuestionRequest();
    };

    return {
        submitQuestionResponse,
        submitQuestionError,
        handleSubmitQuestionRequest,
    };
};