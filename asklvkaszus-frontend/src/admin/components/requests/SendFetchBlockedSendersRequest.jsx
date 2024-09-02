import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendFetchBlockedSendersRequest = () => {
  const { t } = useTranslation();

  const [isBlockedSendersLoading, setBlockedSendersLoading] = useState(true);
  const [blockedSendersError, setBlockedSendersError] = useState(false);
  const [blockedSendersResponse, setBlockedSendersResponse] = useState('');

  const navigate = useNavigate();

  const submitFetchBlockedSendersRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.post(
          `${domain}/api/app/admin/fetch_blocked_senders`,
          {},
          {
            headers: {
              'X-CSRFToken': csrfToken
            }
          }
        );
        
        const data = response.data;

        setBlockedSendersError(false);
        setBlockedSendersResponse(data);
        setBlockedSendersLoading(false);
        
    } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setBlockedSendersResponse('Please login again!');
            setBlockedSendersError(true);
            setBlockedSendersLoading(false);

            navigate('/admin/login');

          } else {
            setBlockedSendersResponse(responseError);
            setBlockedSendersError(true);
            setBlockedSendersLoading(false);

          }
        } else {
          setBlockedSendersError(true);
          setBlockedSendersResponse('');
          setBlockedSendersLoading(false);

          console.error(`${t('admin-error-fetchblockedsenders')} ${error}`);
        }
    }
  };

  const handleFetchBlockedSendersRequest = async () => {
    await submitFetchBlockedSendersRequest();
  };

  return {
    isBlockedSendersLoading,
    blockedSendersError,
    blockedSendersResponse,
    handleFetchBlockedSendersRequest,
  };
};