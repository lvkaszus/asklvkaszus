import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendFetchCaptchaSettingsRequest = () => {
    const [fetchCaptchaSettingsResponse, setFetchCaptchaSettingsResponse] = useState('');
    const [fetchCaptchaSettingsError, setFetchCaptchaSettingsError] = useState(false);

    const navigate = useNavigate();

    const submitFetchCaptchaSettingsRequest = async () => {
        try {
            const response = await axios.get(`${domain}/api/app/admin/configure_captcha`);
            
            const jsonData = response.data;

            setFetchCaptchaSettingsResponse(jsonData);
            setFetchCaptchaSettingsError(false);

        } catch (error) {
            if (error.response) {
                const { error: responseError } = error.response.data;
                
                if (
                    responseError.includes("Token") ||
                    responseError.includes("CSRF")
                ) {
                    setFetchCaptchaSettingsResponse('Please login again!');
                    setFetchCaptchaSettingsError(true);

                    navigate('/admin/login');
                } else {
                    setFetchCaptchaSettingsResponse(responseError);
                    setFetchCaptchaSettingsError(true);
                    
                }
      
              } else {
                setFetchCaptchaSettingsResponse('');
                setFetchCaptchaSettingsError(true);

                console.error('An error occurred while sending a request to download CAPTCHA settings!', error);
              }
          }
    };

    const handleFetchCaptchaSettings = async () => {
        await submitFetchCaptchaSettingsRequest();
    };

    return {
        fetchCaptchaSettingsResponse,
        fetchCaptchaSettingsError,
        handleFetchCaptchaSettings,
    };
};