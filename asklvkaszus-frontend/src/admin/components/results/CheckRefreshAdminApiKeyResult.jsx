import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckRefreshAdminApiKeyResult = ({ open, error, response, onClose }) => {
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
                        return (
                            <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                {t('admin-success-refreshadminapikey')}
                            </Alert>
                        );

                    case true:
                        switch (response) {
                            case "Cannot regenerate API Key while Global API is disabled!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-refreshadminapikey-globalapidisabled')}
                                    </Alert>
                                );
                            case "Cannot regenerate API Key while your Admin API is disabled!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-refreshadminapikey-adminapidisabled')}
                                    </Alert>
                                );
                            case "Rate-limit exceeded! Try again later.":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-refreshadminapikey-ratelimit')}
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
                                        {t('admin-error-refreshadminapikey')}
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

export default CheckRefreshAdminApiKeyResult;
