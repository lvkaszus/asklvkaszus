import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendFetchAdminAppSettingsRequest = () => {
  const { t } = useTranslation();

  const [adminAppSettingsError, setAdminAppSettingsError] = useState(false);
  const [adminAppSettingsResponse, setAdminAppSettingsResponse] = useState('');

  const submitAdminAppSettingsRequest = async () => {
    try {
        const response = await axios.get(
            `${domain}/api/app/admin/app_settings`
          );
        
        const data = response.data;

        setAdminAppSettingsResponse(data);
        setAdminAppSettingsError(false);

    } catch (error) {
        if (error.response) {
            const { error: responseError } = error.response.data;

            setAdminAppSettingsResponse(responseError);
            setAdminAppSettingsError(true);
            
          } else {
            setAdminAppSettingsResponse('');
            setAdminAppSettingsError(true);

            console.error(`${t('admin-error-fetchadminappsettings')} ${error}`);

          }
    }
  };

  const handleFetchAdminAppSettingsRequest = async () => {
    await submitAdminAppSettingsRequest();
  };

  return {
    adminAppSettingsError,
    adminAppSettingsResponse,
    handleFetchAdminAppSettingsRequest,
  };
};