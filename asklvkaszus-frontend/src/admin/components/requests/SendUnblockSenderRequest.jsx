import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendUnblockSenderRequest = (senderIp) => {
  const { t } = useTranslation();

  const [unblockSenderError, setUnblockSenderError] = useState(false);
  const [unblockSenderResponse, setUnblockSenderResponse] = useState('');

  const navigate = useNavigate();

  const submitUnblockSenderRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.delete(
            `${domain}/api/app/admin/unblock_sender`,
            {
              headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json',
              },
              data: {
                sender_ip: senderIp,
              }
            }
          );
        
        const { success } = response.data;

        setUnblockSenderResponse(success);
        setUnblockSenderError(false);

    } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setUnblockSenderResponse('Please login again!');
            setUnblockSenderError(true);

            navigate('/admin/login');

          } else {
            setUnblockSenderResponse(responseError);
            setUnblockSenderError(true);
          }
        } else {
          setUnblockSenderResponse('');
          setUnblockSenderError(true);

          console.error(`${t('admin-error-unblocksender')} ${error}`);
        }
    }
  };

  const handleUnblockSenderRequest = async () => {
    await submitUnblockSenderRequest();
  };

  return {
    unblockSenderError,
    unblockSenderResponse,
    handleUnblockSenderRequest,
  };
};