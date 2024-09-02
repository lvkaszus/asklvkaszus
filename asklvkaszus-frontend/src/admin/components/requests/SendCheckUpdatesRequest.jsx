import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendCheckUpdatesRequest = () => {
  const { t } = useTranslation();

  const [checkUpdatesStatus, setCheckUpdatesStatus] = useState('');
  const [checkUpdatesResponse, setCheckUpdatesResponse] = useState('');
  const [latestVersion, setLatestVersion] = useState('');
  const [currentVersion, setCurrentVersion] = useState('');

  const submitCheckUpdatesRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.post(
            `${domain}/api/app/admin/fetch_updates`,
            {},
            {
              headers: {
                'X-CSRFToken': csrfToken,
              },
            }
          );
        
        const { success, warning, latest_version, current_version } = response.data;

        if (success) {
          setCheckUpdatesStatus('success');
          setCheckUpdatesResponse(success);

        } else if (warning) {
          setCheckUpdatesStatus('warning');
          setCheckUpdatesResponse(warning);
          setLatestVersion(latest_version);
          setCurrentVersion(current_version);

        }
    } catch (error) {
        if (error.response) {
            const { error: responseError } = error.response.data;

            setCheckUpdatesStatus('error');
            setCheckUpdatesResponse(responseError);

          } else {
            setCheckUpdatesStatus('error');
            setCheckUpdatesResponse('');

            console.error(`${t('admin-error-checkupdates')} ${error}`);

          }
    }
  };

  const handleCheckUpdatesRequest = async () => {
    await submitCheckUpdatesRequest();
  };

  return {
    checkUpdatesStatus,
    checkUpdatesResponse,
    latestVersion,
    currentVersion,
    handleCheckUpdatesRequest,
  };
};