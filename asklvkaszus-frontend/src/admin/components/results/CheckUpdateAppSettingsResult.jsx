import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckUpdateAppSettingsResult = ({ open, error, response, onClose }) => {
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
                        case "Application Settings have been updated.":
                            return (
                                <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                    {t('admin-success-updateappsettings')}
                                </Alert>
                            );
                        default:
                            return null;
                    }
                } else {
                    switch (response) {
                        case "global_api_enabled cannot be empty!":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-updateappsettings-inputvarempty', { input_var: 'global_api_enabled' })}
                                </Alert>
                            );
                        case "markdown_frontend_enabled cannot be empty!":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-updateappsettings-inputvarempty', { input_var: 'markdown_frontend_enabled' })}
                                </Alert>
                            );
                        case "markdown_admin_enabled cannot be empty!":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-updateappsettings-inputvarempty', { input_var: 'markdown_admin_enabled' })}
                                </Alert>
                            );
                        case "approve_questions_first cannot be empty!":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-updateappsettings-inputvarempty', { input_var: 'approve_questions_first' })}
                                </Alert>
                            );
                        case "Rate-limit exceeded! Try again later.":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-updateappsettings-ratelimit')}
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
                                    {t('admin-error-updateappsettings')}
                                </Alert>
                            );
                    }
                }
            })()}
        </Snackbar>
    );
};

export default CheckUpdateAppSettingsResult;
