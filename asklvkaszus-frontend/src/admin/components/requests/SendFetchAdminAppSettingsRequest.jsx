import { useState } from 'react';
import axios from 'axios';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendFetchAdminAppSettingsRequest = () => {
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

            if (
              responseError.includes("Token") ||
              responseError.includes("CSRF")
            ) {
              setAdminAppSettingsError(true);
              setAdminAppSettingsResponse('Please login again!');

            } else {
              setAdminAppSettingsResponse(responseError);
              setAdminAppSettingsError(true);
            
            }            
          } else {
            setAdminAppSettingsResponse('');
            setAdminAppSettingsError(true);

            console.error('An error occurred while sending a request to download the admin application settings!', error);

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