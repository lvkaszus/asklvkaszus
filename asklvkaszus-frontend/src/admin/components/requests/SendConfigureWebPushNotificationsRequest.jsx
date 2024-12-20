import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendConfigureWebPushNotificationsRequest = (WebpushEnabled) => {
  const { t } = useTranslation();

  const [configureWebPushNotificationsError, setConfigureWebPushNotificationsError] = useState(false);
  const [configureWebPushNotificationsResponse, setConfigureWebPushNotificationsResponse] = useState('');

  const navigate = useNavigate();

  const submitConfigureWebPushNotificationsRequest = async () => {
    try {
      const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.put(
          `${domain}/api/app/admin/configure_notifications`,
          {
            webpush_enabled: WebpushEnabled,
          },
          {
            headers: {
              'X-CSRFToken': csrfToken
            }
          }
        );
        
        const { success } = response.data;

        setConfigureWebPushNotificationsResponse(success);
        setConfigureWebPushNotificationsError(false);

    } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setConfigureWebPushNotificationsResponse('Please login again!');
            setConfigureWebPushNotificationsError(true);


            navigate('/admin/login');

          } else {
            setConfigureWebPushNotificationsResponse(responseError);
            setConfigureWebPushNotificationsError(true);

          }
        } else {
          setConfigureWebPushNotificationsResponse('');
          setConfigureWebPushNotificationsError(true);

          console.error(`${t('admin-error-configurenotifications')} ${error}`)
        }
    }
  };

  const handleConfigureWebPushNotificationsRequest = async () => {
    await submitConfigureWebPushNotificationsRequest();
  };

  return {
    configureWebPushNotificationsError,
    configureWebPushNotificationsResponse,
    handleConfigureWebPushNotificationsRequest,
  };
};