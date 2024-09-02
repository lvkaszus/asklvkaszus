import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendPurgeAllQuestionsRequest = () => {
  const { t } = useTranslation();

  const [purgeAllQuestionsError, setPurgeAllQuestionsError] = useState(false);
  const [purgeAllQuestionsResponse, setPurgeAllQuestionsResponse] = useState('');

  const navigate = useNavigate();

  const submitPurgeAllQuestionsRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.delete(
            `${domain}/api/app/admin/purge_all_questions`,
            {
              headers: {
                'X-CSRFToken': csrfToken,
              },
            }
          );
        
        const { success } = response.data;

        setPurgeAllQuestionsResponse(success);
        setPurgeAllQuestionsError(false);

    } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setPurgeAllQuestionsResponse('Please login again!');
            setPurgeAllQuestionsError(true);

            navigate('/admin/login');

          } else {
            setPurgeAllQuestionsResponse(responseError);
            setPurgeAllQuestionsError(true);
          }
        } else {
          setPurgeAllQuestionsResponse('');
          setPurgeAllQuestionsError(true);

          console.error(`${t('admin-error-purgeallquestions')} ${error}`);
        }
    }
  };

  const handlePurgeAllQuestionsRequest = async () => {
    await submitPurgeAllQuestionsRequest();
  };

  return {
    purgeAllQuestionsError,
    purgeAllQuestionsResponse,
    handlePurgeAllQuestionsRequest,
  };
};