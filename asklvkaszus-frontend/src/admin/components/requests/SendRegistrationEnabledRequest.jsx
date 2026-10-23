import { useState, useCallback } from 'react';
import axios from 'axios';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendRegistrationEnabledRequest = () => {
  const [registrationEnabledResponse, setRegistrationEnabledResponse] = useState(false);
  const [registrationEnabledError, setRegistrationEnabledError] = useState(false);

  const handleRegistrationInfoRequest = useCallback(async () => {
    try {
      const response = await axios.get(`${domain}/api/app/admin/register`);
        
      const { registration_enabled } = response.data;

      setRegistrationEnabledResponse(registration_enabled);
      setRegistrationEnabledError(false);

    } catch (error) {
      setRegistrationEnabledResponse(false);
      setRegistrationEnabledError(true);

      console.error('An error occurred while sending a request to check if the user registration is enabled!', error);
    }
  }, []);

  return {
    registrationEnabledResponse,
    registrationEnabledError,
    handleRegistrationInfoRequest,
  };
};