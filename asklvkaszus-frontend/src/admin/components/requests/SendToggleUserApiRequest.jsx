import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendToggleUserApiRequest = () => {
  const { t } = useTranslation();

  const [toggleUserApiError, setToggleUserApiError] = useState(false);
  const [toggleUserApiResponse, setToggleUserApiResponse] = useState('');

  const navigate = useNavigate();

  const submitToggleUserApiRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.post(
            `${domain}/api/app/admin/toggle_user_api`,
            {}, 
            {
              headers: {
                'X-CSRFToken': csrfToken,
              },
            }
          );
        
        const { success } = response.data;

        setToggleUserApiResponse(success);
        setToggleUserApiError(false);

    } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setToggleUserApiResponse('Please login again!');
            setToggleUserApiError(true);

            navigate('/admin/login');

          } else {
            setToggleUserApiResponse(responseError);
            setToggleUserApiError(true);
          }
        } else {
          setToggleUserApiResponse('');
          setToggleUserApiError(true);

          console.error(`${t('admin-error-toggleuserapi')} ${error}`);
        }
    }
  };

  const handleToggleUserApiRequest = async () => {
    await submitToggleUserApiRequest();
  };

  return {
    toggleUserApiError,
    toggleUserApiResponse,
    handleToggleUserApiRequest,
  };
};