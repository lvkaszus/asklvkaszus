import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendUpdateAppSettingsRequest = (globalApiEnabled, markdownFrontendEnabled, markdownAdminEnabled, approveQuestionsFirst) => {
  const [updateAppSettingsError, setUpdateAppSettingsError] = useState(false);
  const [updateAppSettingsResponse, setUpdateAppSettingsResponse] = useState('');

  const navigate = useNavigate();

  const submitUpdateAppSettingsRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.post(
          `${domain}/api/app/admin/app_settings`,
          {
            global_api_enabled: globalApiEnabled,
            markdown_frontend_enabled: markdownFrontendEnabled,
            markdown_admin_enabled: markdownAdminEnabled,
            approve_questions_first: approveQuestionsFirst,
          },
          {
            headers: {
              'X-CSRFToken': csrfToken
            }
          }
        );
        
        const { success } = response.data;

        setUpdateAppSettingsResponse(success);
        setUpdateAppSettingsError(false);

      } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setUpdateAppSettingsResponse('Please login again!');
            setUpdateAppSettingsError(true);

            navigate('/admin/login');

          } else {
            setUpdateAppSettingsResponse(responseError);
            setUpdateAppSettingsError(true);

          }
        } else {
          setUpdateAppSettingsResponse('');
          setUpdateAppSettingsError(true);

          console.error('An error occurred while sending a request to update the application settings!', error);
        }
    }
  };

  const handleUpdateAppSettingsRequest = async () => {
    await submitUpdateAppSettingsRequest();
  };

  return {
    updateAppSettingsError,
    updateAppSettingsResponse,
    handleUpdateAppSettingsRequest,
  };
};