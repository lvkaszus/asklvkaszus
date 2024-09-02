import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendUnblockAllSendersRequest = () => {
  const { t } = useTranslation();

  const [unblockAllSendersError, setUnblockAllSendersError] = useState(false);
  const [unblockAllSendersResponse, setUnblockAllSendersResponse] = useState('');

  const navigate = useNavigate();

  const submitUnblockAllSendersRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.delete(
            `${domain}/api/app/admin/unblock_all_senders`,
            {
              headers: {
                'X-CSRFToken': csrfToken,
              },
            }
          );
        
        const { success } = response.data;

        setUnblockAllSendersResponse(success);
        setUnblockAllSendersError(false);

    } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setUnblockAllSendersResponse('Please login again!');
            setUnblockAllSendersError(true);

            navigate('/admin/login');

          } else {
            setUnblockAllSendersResponse(responseError);
            setUnblockAllSendersError(true);

          }
        } else {
            setUnblockAllSendersResponse('');
            setUnblockAllSendersError(true);

            console.error(`${t('admin-error-unblockallsenders')} ${error}`);
        }
    }
  };

  const handleUnblockAllSendersRequest = async () => {
    await submitUnblockAllSendersRequest();
  };

  return {
    unblockAllSendersError,
    unblockAllSendersResponse,
    handleUnblockAllSendersRequest,
  };
};