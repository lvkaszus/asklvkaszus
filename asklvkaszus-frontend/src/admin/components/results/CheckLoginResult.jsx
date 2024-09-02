import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckLoginResult = ({ open, error, response, onClose }) => {
    const { t } = useTranslation();

    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            autoHideDuration={5000}
            key={response}
            onClose={onClose}
        >
            {(() => {
                switch (error) {
                    case false:
                        switch (response) {
                            case "Successfully logged in.":
                                return (
                                    <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                        {t('admin-success-login')}
                                    </Alert>
                                );
                            default:
                                return null;
                        }
                    case true:
                        switch (response) {
                            case "Incorrect login or password.":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-login-incorrectloginorpassword')}
                                    </Alert>
                                );
                            case "Rate-limit exceeded! Try again later.":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-login-ratelimit')}
                                    </Alert>
                                );
                            default:
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-login')}
                                    </Alert>
                                );
                        }
                    default:
                        return null;
                }
            })()}
        </Snackbar>
    );
};

export default CheckLoginResult;
