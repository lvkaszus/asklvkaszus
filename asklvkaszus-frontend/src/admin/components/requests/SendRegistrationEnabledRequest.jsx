import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendRegistrationEnabledRequest = () => {
  const { t } = useTranslation();

  const [registrationEnabledResponse, setRegistrationEnabledResponse] = useState(false);
  const [registrationEnabledError, setRegistrationEnabledError] = useState(false);

  const submitRegistrationInfoRequest = async () => {
    try {
      const response = await axios.get(`${domain}/api/app/admin/register`);
        
      const { registration_enabled } = response.data;

      setRegistrationEnabledResponse(registration_enabled);
      setRegistrationEnabledError(false);

    } catch (error) {
      setRegistrationEnabledResponse(false);
      setRegistrationEnabledError(true);

      console.error(`${t('admin-error-getregistrationenabled')} ${error}`);
    }
  };

  const handleRegistrationInfoRequest = async () => {
    await submitRegistrationInfoRequest();
  };

  return {
    registrationEnabledResponse,
    registrationEnabledError,
    handleRegistrationInfoRequest,
  };
};