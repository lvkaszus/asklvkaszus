import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendLogout = () => {
  const [logoutError, setLogoutError] = useState(false);
  const [logoutResponse, setLogoutResponse] = useState('');

  const navigate = useNavigate();

  const submitLogoutRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.post(
            `${domain}/api/app/admin/logout`, {},
            {
              headers: {
                'X-CSRFToken': csrfToken,
              },
            }
          );
        
        const { success } = response.data;

        setLogoutResponse(success);
        setLogoutError(false);

        setTimeout(() => {
          navigate('/admin/login');
        }, 1000);

    } catch (error) {
      if (error.response) {
        const { error: responseError } = error.response.data;
        
        if (
          responseError.includes("Token") ||
          responseError.includes("CSRF")
        ) {
          setLogoutResponse('Please login again!');
          setLogoutError(true);

          navigate('/admin/login');

        } else {
          setLogoutResponse(responseError);
          setLogoutError(true);

        }
      } else {
        setLogoutError(false);
        setLogoutResponse('');

        console.error('An error occurred while sending a logout request!', error);

      }
    }
  };

  const handleLogoutRequest = async () => {
    await submitLogoutRequest();
  };

  return {
    logoutError,
    logoutResponse,
    handleLogoutRequest,
  };
};