import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckConfigureTelegramNotificationsResult = ({ open, error, response, onClose }) => {
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
                            case "Invalid JSON payload!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-invalidjsonpayload')}
                                    </Alert>
                                )
                            case "User not found!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-usernotfound')}
                                    </Alert>
                                )
                            case "An error occurred while generating VAPID Keys!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-generatevapidkeys')}
                                    </Alert>
                                )
                            case "An error occurred while checking VAPID Keys!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-checkvapidkeys')}
                                    </Alert>
                                )
                            case "telegram_enabled must be boolean!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-inputvarmustbeabool', { input_var: 'telegram_enabled' })}
                                    </Alert>
                                );
                            case "telegram_bot_token cannot be empty!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-emptybottoken')}
                                    </Alert>
                                );
                            case "Invalid Telegram Bot Token!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-invalidbottoken')}
                                    </Alert>
                                );
                            case "Failed to verify provided Telegram Bot Token because of Telegram API Timeout Error!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-telegramapitimeout')}
                                    </Alert>
                                );
                            case "Failed to verify provided Telegram Bot Token because Telegram API returned an error!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-telegramapierror')}
                                    </Alert>
                                );
                            case "Failed to verify provided Telegram Bot Token! Try again later.":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-bottokenverificationfailure')}
                                    </Alert>
                                );
                            case "telegram_bot_chat_id cannot be empty!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-emptybotchatid')}
                                    </Alert>
                                );
                            case "telegram_bot_chat_id must be a number!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-botchatidmustbeanumber')}
                                    </Alert>
                                );
                            case "telegram_bot_chat_id cannot be zero!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-botchatidcannotbezero')}
                                    </Alert>
                                );
                            case "telegram_bot_chat_id cannot be longer than 20 characters!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-configurenotifications-botchatidtoolong')}
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

export default CheckConfigureTelegramNotificationsResult;
