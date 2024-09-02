import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckUnblockSenderResult = ({ open, error, response, sender_ip, onClose }) => {
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
                        case `Sender with IP Address ${sender_ip} unbanned successfully!`:
                            return (
                                <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                    {t('admin-success-unblocksender', { sender_ip: sender_ip })}
                                </Alert>
                            );
                        default:
                            return null;
                    }
                } else {
                    switch (response) {
                        case "Sender IP Address cannot be empty!":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-unblocksender-noip')}
                                </Alert>
                            );
                        case `Sender with IP Address ${sender_ip} not found!`:
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-unblocksender-notfound', { sender_ip: sender_ip })}
                                </Alert>
                            );
                        case "Rate-limit exceeded! Try again later.":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-unblocksender-ratelimit')}
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
                                    {t('admin-error-unblocksender')}
                                </Alert>
                            );
                    }
                }
            })()}
        </Snackbar>
    );
};

export default CheckUnblockSenderResult;
