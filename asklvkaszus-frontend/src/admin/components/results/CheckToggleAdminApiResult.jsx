import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckToggleAdminApiResult = ({ open, error, response, username, onClose }) => {
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
                if (!error) {
                    switch (response) {
                        case `Admin API Access for user ${username} has been disabled!`:
                            return (
                                <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                    {t('admin-success-toggleadminapi-disabled', { username: username })}
                                </Alert>
                            );
                        case `Admin API Access for user ${username} has been enabled!`:
                            return (
                                <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                    {t('admin-success-toggleadminapi-enabled', { username: username })}
                                </Alert>
                            );
                        default:
                            return null;
                    }
                } else {
                    switch (response) {
                        case "Cannot toggle Admin API while Global API is disabled!":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-toggleadminapi-globalapidisabled')}
                                </Alert>
                            );
                        case "Rate-limit exceeded! Try again later.":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-toggleadminapi-ratelimit')}
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
                                    {t('admin-error-toggleadminapi')}
                                </Alert>
                            );
                    }
                }
            })()}
        </Snackbar>
    );
};

export default CheckToggleAdminApiResult;
