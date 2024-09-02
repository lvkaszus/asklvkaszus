import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendFetchUserAppSettingsRequest = () => {
  const { t } = useTranslation();

  const [userAppSettingsResponse, setUserAppSettingsResponse] = useState('');
  const [userAppSettingsError, setUserAppSettingsError] = useState(false);

  const submitFetchUserAppSettingsRequest = async () => {
    try {
      const response = await axios.get(`${domain}/api/app/user/app_settings`);
        
      const data = response.data;

      setUserAppSettingsResponse(data);
      setUserAppSettingsError(false);

    } catch (error) {
      if (error.response) {
        const { error: responseError } = error.response.data;

        setUserAppSettingsResponse(responseError);
        setUserAppSettingsError(true);

      } else {
        setUserAppSettingsResponse('');
        setUserAppSettingsError(true);

        console.error(t('error-fetchuserappsettings') + error);

      }
    }
  };

  const handleFetchUserAppSettingsRequest = async () => {
    await submitFetchUserAppSettingsRequest();
  };

  return {
    userAppSettingsResponse,
    userAppSettingsError,
    handleFetchUserAppSettingsRequest,
  };
};