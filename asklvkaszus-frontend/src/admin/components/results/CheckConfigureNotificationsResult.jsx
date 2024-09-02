import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckConfigureNotificationsResult = ({ open, error, response, onClose }) => {
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
                            case "Notifications Settings have been updated.":
                                return (
                                    <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                        {t('admin-success-configurenotifications')}
                                    </Alert>
                                );
                            default:
                                return null;
                        }
                    case true:
                    default:
                        switch (response) {
                            case "telegram_bot_token cannot be empty!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-emptybottoken')}
                                    </Alert>
                                );
                            case "telegram_bot_chat_id cannot be empty!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-emptybotchatid')}
                                    </Alert>
                                );
                            case "Rate-limit exceeded! Try again later.":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-ratelimit')}
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
                                        {t('admin-error-configurenotifications')}
                                    </Alert>
                                );
                        }
                }
            })()}
        </Snackbar>
    );
};

export default CheckConfigureNotificationsResult;
