import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendPurgeQuestionRequest = (questionId) => {
  const { t } = useTranslation();

  const [purgeQuestionError, setPurgeQuestionError] = useState(false);
  const [purgeQuestionResponse, setPurgeQuestionResponse] = useState('');

  const navigate = useNavigate();

  const submitPurgeQuestionRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.delete(
          `${domain}/api/app/admin/purge_question`,
          {
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json',
            },
            data: { 
                question_id: questionId
            }
          }
        );
        
        const { success } = response.data;

        setPurgeQuestionResponse(success);
        setPurgeQuestionError(false);

    } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setPurgeQuestionResponse('Please login again!');
            setPurgeQuestionError(true);

            navigate('/admin/login');

          } else {
            setPurgeQuestionResponse(responseError);
            setPurgeQuestionError(true);

          }
        } else {
          setPurgeQuestionResponse('');
          setPurgeQuestionError(true);

          console.error(`${t('admin-error-purgequestion')} ${error}`);

        }
    }
  };

  const handlePurgeQuestionRequest = async () => {
    await submitPurgeQuestionRequest();
  };

  return {
    purgeQuestionError,
    purgeQuestionResponse,
    handlePurgeQuestionRequest,
  };
};