import { useState, useCallback } from 'react';
import axios from 'axios';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendFetchAdminAppSettingsRequest = () => {
  const [adminAppSettingsError, setAdminAppSettingsError] = useState(false);
  const [adminAppSettingsResponse, setAdminAppSettingsResponse] = useState('');

  const handleFetchAdminAppSettingsRequest = useCallback(async () => {
    try {
      setAdminAppSettingsError(false);

      const response = await axios.get(
        `${domain}/api/app/admin/app_settings`
      );

      setAdminAppSettingsResponse(response.data);

    } catch (error) {
      if (error.response) {
        const { error: responseError } = error.response.data;

        if (
          responseError?.includes("Token") ||
          responseError?.includes("CSRF")
        ) {
          setAdminAppSettingsResponse('Please login again!');
        } else {
          setAdminAppSettingsResponse(responseError);
        }

        setAdminAppSettingsError(true);

      } else {
        console.error(
          'An error occurred while sending a request to download the admin application settings!',
          error
        );

        setAdminAppSettingsResponse('');
        setAdminAppSettingsError(true);
      }
    }
  }, []);

  return {
    adminAppSettingsError,
    adminAppSettingsResponse,
    handleFetchAdminAppSettingsRequest,
  };
};