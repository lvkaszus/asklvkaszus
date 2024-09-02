import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendRefreshAdminApiKeyRequest = () => {
  const { t } = useTranslation();

  const [refreshAdminApiKeyError, setRefreshAdminApiKeyError] = useState(false);
  const [refreshAdminApiKeyResponse, setRefreshAdminApiKeyResponse] = useState('');
  const [newAdminApiKey, setNewAdminApiKey] = useState('');

  const refreshAdminApiKeyRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.post(
            `${domain}/api/app/admin/refresh_api_token`,
            {},
            {
              headers: {
                'X-CSRFToken': csrfToken,
              },
            }
          );
        
        const { generated_api_key } = response.data;

        setRefreshAdminApiKeyResponse('success');
        setNewAdminApiKey(generated_api_key);
        setRefreshAdminApiKeyError(false);

    } catch (error) {
        if (error.response) {
            const { error: responseError } = error.response.data;

            setRefreshAdminApiKeyResponse(responseError);
            setNewAdminApiKey('');
            setRefreshAdminApiKeyError(true);

          } else {
            setRefreshAdminApiKeyResponse('');
            setNewAdminApiKey('')
            setRefreshAdminApiKeyError(true);

            console.error(`${t('admin-error-refreshadminapikey')} ${error}`);

          }
    }
  };

  const handleRefreshAdminApiKeyRequest = async () => {
    await refreshAdminApiKeyRequest();
  };

  return {
    refreshAdminApiKeyError,
    refreshAdminApiKeyResponse,
    newAdminApiKey,
    handleRefreshAdminApiKeyRequest,
  };
};