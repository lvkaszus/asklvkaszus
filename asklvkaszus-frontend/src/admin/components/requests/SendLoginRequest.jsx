import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendLoginRequest = (username, password) => {
  const [loginError, setLoginError] = useState(false);
  const [loginResponse, setLoginResponse] = useState('');

  const navigate = useNavigate();

  const submitLoginRequest = async (captcha_token) => {
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

    } catch (error) {
        if (error.response) {
            const { error: responseError } = error.response.data;
            
            setLoginResponse(responseError);
            setLoginError(true);

          } else {
            setLoginResponse('');
            setLoginError(true);

            console.error('There was an error when sending the account login request!', error);

          }
    }
  };

  const handleLoginRequest = async (captcha_token) => {
    await submitLoginRequest(captcha_token);
  };

  return {
    loginError,
    loginResponse,
    handleLoginRequest,
  };
};