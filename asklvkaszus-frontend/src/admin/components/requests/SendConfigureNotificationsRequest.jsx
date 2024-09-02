import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendConfigureNotificationsRequest = (telegramEnabled, telegramBotToken, telegramBotChatId) => {
  const { t } = useTranslation();

  const [configureNotificationsError, setConfigureNotificationsError] = useState(false);
  const [configureNotificationsResponse, setConfigureNotificationsResponse] = useState('');

  const navigate = useNavigate();

  const submitConfigureNotificationsRequest = async () => {
    try {
      const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.put(
          `${domain}/api/app/admin/configure_notifications`,
          {
            telegram_enabled: telegramEnabled,
            telegram_bot_token: telegramBotToken,
            telegram_bot_chat_id: telegramBotChatId
          },
          {
            headers: {
              'X-CSRFToken': csrfToken
            }
          }
        );
        
        const { success } = response.data;

        setConfigureNotificationsResponse(success);
        setConfigureNotificationsError(false);

    } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setConfigureNotificationsResponse('Please login again!');
            setConfigureNotificationsError(true);


            navigate('/admin/login');

          } else {
            setConfigureNotificationsResponse(responseError);
            setConfigureNotificationsError(true);

          }
        } else {
          setConfigureNotificationsResponse('');
          setConfigureNotificationsError(true);

          console.error(`${t('admin-error-configurenotifications')} ${error}`)
        }
    }
  };

  const handleConfigureNotificationsRequest = async () => {
    await submitConfigureNotificationsRequest();
  };

  return {
    configureNotificationsError,
    configureNotificationsResponse,
    handleConfigureNotificationsRequest,
  };
};