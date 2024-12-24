import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendFetchVapidPublicKeyRequest = () => {
  const { t } = useTranslation();

  const [fetchVapidPublicKeyError, setFetchVapidPublicKeyError] = useState(false);
  const [fetchVapidPublicKeyResponse, setFetchVapidPublicKeyResponse] = useState('');

  const submitFetchVapidPublicKeyRequest = async () => {
    try {
      const response = await axios.get(`${domain}/api/app/admin/fetch_vapid_public_key`);
      
      const { public_key } = response.data;

      setFetchVapidPublicKeyResponse(public_key);
      setFetchVapidPublicKeyError(false);

    } catch (error) {
      if (error.response) {
        const { error: responseError } = error.response.data;

        setFetchVapidPublicKeyResponse(responseError);
        setFetchVapidPublicKeyError(true);

      } else {
        setFetchVapidPublicKeyResponse('');
        setFetchVapidPublicKeyError(true);

        console.error(`${t('admin-error-fetchvapidpublickey')} ${error}`);
        
      }
    }
  };

  const handleFetchVapidPublicKeyRequest = async () => {
    await submitFetchVapidPublicKeyRequest();
  };

  return {
    fetchVapidPublicKeyError,
    fetchVapidPublicKeyResponse,
    handleFetchVapidPublicKeyRequest,
  };
};