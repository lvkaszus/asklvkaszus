import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendBlockSenderRequest = (senderIp) => {
  const { t } = useTranslation();

  const [blockSenderError, setBlockSenderError] = useState(false);
  const [blockSenderResponse, setBlockSenderResponse] = useState('');

  const navigate = useNavigate();

  const submitBlockSenderRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.post(
            `${domain}/api/app/admin/block_sender`,
            { sender_ip: senderIp }, {
              headers: {
                'X-CSRFToken': csrfToken,
              },
            }
          );
        
        const { success } = response.data;

        setBlockSenderResponse(success);
        setBlockSenderError(false);

      } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setBlockSenderResponse('Please login again!');
            setBlockSenderError(true);

            navigate('/admin/login');

          } else {
            setBlockSenderResponse(responseError);
            setBlockSenderError(true);

          }
        } else {
          setBlockSenderResponse('');
          setBlockSenderError(true);

          console.error(`${t('admin-error-blocksender')} ${error}`);
        }
    }
  };

  const handleBlockSenderRequest = async () => {
    await submitBlockSenderRequest();
  };

  return {
    blockSenderError,
    blockSenderResponse,
    handleBlockSenderRequest,
  };
};