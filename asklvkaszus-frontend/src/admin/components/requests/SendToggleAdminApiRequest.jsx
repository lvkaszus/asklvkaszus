import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendToggleAdminApiRequest = () => {
  const { t } = useTranslation();

  const [toggleAdminApiError, setToggleAdminApiError] = useState(false);
  const [toggleAdminApiResponse, setToggleAdminApiResponse] = useState('');

  const navigate = useNavigate();

  const submitToggleAdminApiRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.post(
            `${domain}/api/app/admin/toggle_admin_api`,
            {}, 
            {
              headers: {
                'X-CSRFToken': csrfToken,
              },
            }
          );
        
        const { success } = response.data;

        setToggleAdminApiResponse(success);
        setToggleAdminApiError(false);

    } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setToggleAdminApiResponse('Please login again!');
            setToggleAdminApiError(true);

            navigate('/admin/login');

          } else {
            setToggleAdminApiResponse(responseError);
            setToggleAdminApiError(true);

          }
        } else {
          setToggleAdminApiResponse('');
          setToggleAdminApiError(true);

          console.error(`${t('admin-error-toggleadminapi')} ${error}`);
        }
    }
  };

  const handleToggleAdminApiRequest = async () => {
    await submitToggleAdminApiRequest();
  };

  return {
    toggleAdminApiError,
    toggleAdminApiResponse,
    handleToggleAdminApiRequest,
  };
};