import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendFetchUserDataRequest = () => {
  const { t } = useTranslation();

  const [userDataError, setUserDataError] = useState(false);
  const [userDataResponse, setUserDataResponse] = useState('');

  const navigate = useNavigate();

  const submitFetchUserDataRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.post(
          `${domain}/api/app/admin/user_info`,
          {},
          {
            headers: {
              'X-CSRFToken': csrfToken
            }
          }
        );
        
        const data = response.data;

        setUserDataResponse(data);
        setUserDataError(false);

      } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setUserDataResponse('Please login again!');
            setUserDataError(false);

            navigate('/admin/login');

          } else {
            setUserDataResponse(responseError);
            setUserDataError(true);

          }
        } else {
          setUserDataResponse('');
          setUserDataError();
          
          console.error(`${t('admin-error-userdata')} ${error}`);
        }
    }
  };

  const handleFetchUserDataRequest = async () => {
    await submitFetchUserDataRequest();
  };

  return {
    userDataError,
    userDataResponse,
    handleFetchUserDataRequest,
  };
};