import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendToggleAllQuestionsVisibilityRequest = () => {
  const { t } = useTranslation();

  const [toggleAllQuestionsVisibilityError, setToggleAllQuestionsVisibilityError] = useState(false);
  const [toggleAllQuestionsVisibilityResponse, setToggleAllQuestionsVisibilityResponse] = useState('');

  const navigate = useNavigate();

  const submitToggleAllQuestionsVisibilityRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.post(
            `${domain}/api/app/admin/toggle_all_questions_visibility`,
            {}, 
            {
              headers: {
                'X-CSRFToken': csrfToken,
              },
            }
          );
        
        const { success } = response.data;

        setToggleAllQuestionsVisibilityResponse(success);
        setToggleAllQuestionsVisibilityError(false);

    } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setToggleAllQuestionsVisibilityResponse('Please login again!');
            setToggleAllQuestionsVisibilityError(true);

            navigate('/admin/login');

          } else {
            setToggleAllQuestionsVisibilityResponse(responseError);
            setToggleAllQuestionsVisibilityError(true);

          }
        } else {
          setToggleAllQuestionsVisibilityResponse('');
          setToggleAllQuestionsVisibilityError(true);

          console.error(`${t('admin-error-toggleallquestionsvisibility')} ${error}`);
        }
    }
  };

  const handleToggleAllQuestionsVisibilityRequest = async () => {
    await submitToggleAllQuestionsVisibilityRequest();
  };

  return {
    toggleAllQuestionsVisibilityError,
    toggleAllQuestionsVisibilityResponse,
    handleToggleAllQuestionsVisibilityRequest,
  };
};