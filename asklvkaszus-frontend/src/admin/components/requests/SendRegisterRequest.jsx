import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendRegisterRequest = () => {
  const [registerError, setRegisterError] = useState(false);
  const [registerResponse, setRegisterResponse] = useState('');

  const navigate = useNavigate();

  const handleRegisterRequest = useCallback(async ({ username, password, confirmPassword, captcha_token }) => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.post(
            `${domain}/api/app/admin/register`,
            {
              username: username,
              password: password,
              confirm_password: confirmPassword,
              captcha_token: captcha_token,
            },
            {
              headers: {
                'X-CSRFToken': csrfToken,
              },
            }
          );
        
        const { success } = response.data;

        setRegisterResponse(success);
        setRegisterError(false);

        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);

        return { success: true };
    } catch (error) {
        if (error.response) {
            const { error: responseError } = error.response.data;

            setRegisterResponse(responseError);
            setRegisterError(true);

            return { success: false, error: responseError };
            
          } else {
            setRegisterResponse('');
            setRegisterError(true);

            console.error('An error occurred while sending the account registration request!', error);

            return { success: false };
          }
    }
  }, [navigate]);

  return {
    registerError,
    registerResponse,
    handleRegisterRequest,
  };
};