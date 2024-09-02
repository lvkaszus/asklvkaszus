import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendToggleQuestionVisibilityRequest = (questionId) => {
  const { t } = useTranslation();

  const [toggleQuestionVisibilityError, setToggleQuestionVisibilityError] = useState(false);
  const [toggleQuestionVisibilityResponse, setToggleQuestionVisibilityResponse] = useState('');

  const navigate = useNavigate();

  const submitToggleQuestionVisibilityRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.post(
            `${domain}/api/app/admin/toggle_question_visibility`,
            { question_id: questionId },
            {
              headers: {
                'X-CSRFToken': csrfToken,
              },
            }
          );
        
        const { success } = response.data;

        setToggleQuestionVisibilityResponse(success);
        setToggleQuestionVisibilityError(false);

    } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setToggleQuestionVisibilityResponse('Please login again!');
            setToggleQuestionVisibilityError(true);

            navigate('/admin/login');

          } else {
            setToggleQuestionVisibilityResponse(responseError);
            setToggleQuestionVisibilityError(true);

          }
        } else {
          setToggleQuestionVisibilityResponse('');
          setToggleQuestionVisibilityError(true);

          console.error(`${t('admin-error-togglequestionvisibility')} ${error}`);

        }
    }
  };

  const handleToggleQuestionVisibilityRequest = async () => {
    await submitToggleQuestionVisibilityRequest();
  };

  return {
    toggleQuestionVisibilityError,
    toggleQuestionVisibilityResponse,
    handleToggleQuestionVisibilityRequest,
  };
};