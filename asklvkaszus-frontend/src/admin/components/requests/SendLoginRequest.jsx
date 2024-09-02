import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendLoginRequest = (username, password) => {
  const { t } = useTranslation();

  const [loginError, setLoginError] = useState(false);
  const [loginResponse, setLoginResponse] = useState('');

  const navigate = useNavigate();

  const submitLoginRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.post(
            `${domain}/api/app/admin/login`,
            { username: username, password: password },
            {
              headers: {
                'X-CSRFToken': csrfToken,
              },
            }
          );
        
        const { success } = response.data;

        setLoginResponse(success);
        setLoginError(false);

        setTimeout(() => {
          navigate('/admin/home');
        }, 1000);

    } catch (error) {
        if (error.response) {
            const { error: responseError } = error.response.data;
            
            setLoginResponse(responseError);
            setLoginError(true);

          } else {
            setLoginResponse('');
            setLoginError(true);

            console.error(`${t('admin-error-login')} ${error}`);

          }
    }
  };

  const handleLoginRequest = async () => {
    await submitLoginRequest();
  };

  return {
    loginError,
    loginResponse,
    handleLoginRequest,
  };
};