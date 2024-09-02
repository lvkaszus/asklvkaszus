import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendChangePasswordRequest = (oldPassword, newPassword, confirmNewPassword) => {
  const { t } = useTranslation();

  const [changePasswordError, setChangePasswordError] = useState(false);
  const [changePasswordResponse, setChangePasswordResponse] = useState('');

  const navigate = useNavigate();

  const submitChangePasswordRequest = async () => {
    try {
      const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.put(
          `${domain}/api/app/admin/change_password`,
          {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_new_password: confirmNewPassword
          },
          {
            headers: {
              'X-CSRFToken': csrfToken
            }
          }
        );
        
        const { success } = response.data;

        setChangePasswordResponse(success);
        setChangePasswordError(false);

    } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setChangePasswordResponse('Please login again!');
            setChangePasswordError(true);

            navigate('/admin/login');

          } else {
            setChangePasswordResponse(responseError);
            setChangePasswordError(true);

          }
        } else {
          setChangePasswordResponse('');
          setChangePasswordError(true);

          console.error(`${t('admin-error-changepassword')} ${error}`)
        }
    }
  };

  const handleChangePasswordRequest = async () => {
    await submitChangePasswordRequest();
  };

  return {
    changePasswordError,
    changePasswordResponse,
    handleChangePasswordRequest,
  };
};