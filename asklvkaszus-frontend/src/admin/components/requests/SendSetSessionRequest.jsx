import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';
import { useNavigate } from 'react-router-dom';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendSetSessionRequest = () => {
  const { t } = useTranslation();

  const [sessionUsername, setSessionUsername] = useState('');

  const navigate = useNavigate();

  const submitSetSessionRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.post(`${domain}/api/app/admin/session_guard`, {},
          {
            headers: {
              'X-CSRFToken': csrfToken
            }
          }
        );
        
        const { logged_in_as } = response.data;

        setSessionUsername(logged_in_as);

    } catch (error) {
        if (error.response) {
            setSessionUsername('');

            navigate('/admin/login');
        } else {
            setSessionUsername('');

            navigate('/admin/login');

            console.error(`${t('admin-error-sessionguard')} ${error}`);
        }
    }
  };

  const handleSetSessionRequest = async () => {
    await submitSetSessionRequest();
  };

  return {
    sessionUsername,
    handleSetSessionRequest,
  };
};