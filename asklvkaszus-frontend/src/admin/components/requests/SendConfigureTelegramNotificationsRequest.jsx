import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendConfigureTelegramNotificationsRequest = (telegramEnabled, telegramBotToken, telegramBotChatId) => {
  const { t } = useTranslation();

  const [configureTelegramNotificationsError, setConfigureTelegramNotificationsError] = useState(false);
  const [configureTelegramNotificationsResponse, setConfigureTelegramNotificationsResponse] = useState('');

  const navigate = useNavigate();

  const submitConfigureTelegramNotificationsRequest = async () => {
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

        setConfigureTelegramNotificationsResponse(success);
        setConfigureTelegramNotificationsError(false);

    } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setConfigureTelegramNotificationsResponse('Please login again!');
            setConfigureTelegramNotificationsError(true);


            navigate('/admin/login');

          } else {
            setConfigureTelegramNotificationsResponse(responseError);
            setConfigureTelegramNotificationsError(true);

          }
        } else {
          setConfigureTelegramNotificationsResponse('');
          setConfigureTelegramNotificationsError(true);

          console.error(`${t('admin-error-configurenotifications')} ${error}`)
        }
    }
  };

  const handleConfigureTelegramNotificationsRequest = async () => {
    await submitConfigureTelegramNotificationsRequest();
  };

  return {
    configureTelegramNotificationsError,
    configureTelegramNotificationsResponse,
    handleConfigureTelegramNotificationsRequest,
  };
};