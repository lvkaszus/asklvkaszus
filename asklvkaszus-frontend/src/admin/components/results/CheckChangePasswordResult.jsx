import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckChangePasswordResult = ({ open, error, response, onClose }) => {
    const { t } = useTranslation();

    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            sx={{ marginTop: '60px' }}
            autoHideDuration={5000}
            key={response}
            onClose={onClose}
        >
            {(() => {
                switch (error) {
                    case false:
                        switch (response) {
                            case "Password change successful!":
                                return (
                                    <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                        {t('admin-success-changepassword')}
                                    </Alert>
                                );
                            default:
                                return null;
                        }
                    case true:
                    default:
                        switch (response) {
                            case "New password must be at least 12 characters long!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-changepassword-toofewcharacters')}
                                    </Alert>
                                );
                            case "New password must contain at least one uppercase letter!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-changepassword-nouppercase')}
                                    </Alert>
                                );
                            case "New password must contain at least one number!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-changepassword-nodigit')}
                                    </Alert>
                                );
                            case "Password must contain at least one special character like: !, @, #, $, %, ^, &, *":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-changepassword-nospecial')}
                                    </Alert>
                                );
                            case "New password must not be the same as old password!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-changepassword-notunique')}
                                    </Alert>
                                );
                            case "Confirmed password is not the same as new password!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-changepassword-nomatch')}
                                    </Alert>
                                );
                            case "Incorrect old password!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-changepassword-incorrectoldpassword')}
                                    </Alert>
                                );
                            case "Rate-limit exceeded! Try again later.":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-changepassword-ratelimit')}
                                    </Alert>
                                );
                            case "Please login again!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-pleaseloginagain')}
                                    </Alert>
                                );
                            default:
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-changepassword')}
                                    </Alert>
                                );
                        }
                }
            })()}
        </Snackbar>
    );
};

export default CheckChangePasswordResult;
