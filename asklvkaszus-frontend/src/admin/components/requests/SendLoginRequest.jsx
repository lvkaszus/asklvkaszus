import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendLoginRequest = () => {
  const [loginError, setLoginError] = useState(false);
  const [loginResponse, setLoginResponse] = useState('');

  const navigate = useNavigate();

  const handleLoginRequest = useCallback(async ({ username, password, captcha_token }) => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.post(
            `${domain}/api/app/admin/login`,
            {
              username: username,
              password: password,
              captcha_token: captcha_token,
            },
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

        return { success: true };

    } catch (error) {
        if (error.response) {
            const { error: responseError } = error.response.data;
            
            setLoginResponse(responseError);
            setLoginError(true);

            return { success: false, error: responseError };

          } else {
            setLoginResponse('');
            setLoginError(true);

            console.error('There was an error when sending the account login request!', error);

            return { success: false };
          }
    }
  }, [navigate]);

  return {
    loginError,
    loginResponse,
    handleLoginRequest,
  };
};