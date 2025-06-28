import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendUpdateCaptchaSettingsRequest = (captcha_enabled, captcha_provider, captcha_site_key, captcha_secret_key) => {
    const [updateCaptchaSettingsResponse, setUpdateCaptchaSettingsResponse] = useState('');
    const [updateCaptchaSettingsError, setUpdateCaptchaSettingsError] = useState(false);

    const navigate = useNavigate();

    const submitUpdateCaptchaSettingsRequest = async () => {
        try {
            const csrfToken = await SendFetchCsrfTokenRequest();

            const response = await axios.put(`${domain}/api/app/admin/configure_captcha`,
              {
                captcha_enabled: captcha_enabled,
                captcha_provider: captcha_provider,
                captcha_site_key: captcha_site_key,
                captcha_secret_key: captcha_secret_key
              },
              {
                headers: {
                  'X-CSRFToken': csrfToken
                }
              }
            );
            
            const { success } = response.data;

            setUpdateCaptchaSettingsResponse(success);
            setUpdateCaptchaSettingsError(false);

        } catch (error) {
            if (error.response) {
                const { error: responseError } = error.response.data;
                
                if (
                    responseError.includes("Token") ||
                    responseError.includes("CSRF")
                ) {
                    setUpdateCaptchaSettingsResponse('Please login again!');
                    setUpdateCaptchaSettingsError(true);

                    navigate('/admin/login');
                } else {
                    setUpdateCaptchaSettingsResponse(responseError);
                    setUpdateCaptchaSettingsError(true);
                    
                }
      
              } else {
                setUpdateCaptchaSettingsResponse('');
                setUpdateCaptchaSettingsError(true);

                console.error('An error occurred while sending a request to download CAPTCHA settings!', error);
              }
          }
    };

    const handleUpdateCaptchaSettings = async () => {
        await submitUpdateCaptchaSettingsRequest();
    };

    return {
        updateCaptchaSettingsResponse,
        updateCaptchaSettingsError,
        handleUpdateCaptchaSettings,
    };
};