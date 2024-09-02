import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckUnblockAllSendersResult = ({ open, error, response, onClose }) => {
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
                        case "All senders have been successfully unbanned!":
                            return (
                                <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                    {t('admin-success-unblockallsenders')}
                                </Alert>
                            );
                        default:
                            return null;
                    }
                } else {
                    switch (response) {
                        case "Rate-limit exceeded! Try again later.":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-unblockallsenders-ratelimit')}
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
                                    {t('admin-error-unblockallsenders')}
                                </Alert>
                            );
                    }
                }
            })()}
        </Snackbar>
    );
};

export default CheckUnblockAllSendersResult;
