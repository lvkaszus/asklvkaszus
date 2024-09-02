import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckBlockSenderResult = ({ open, error, response, sender_ip, onClose }) => {
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
                            case `Sender with IP Address ${sender_ip} banned successfully!`:
                                return (
                                    <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                        {t('admin-success-blocksender', { sender_ip: sender_ip })}
                                    </Alert>
                                );
                            default:
                                return null;
                        }
                    case true:
                    default:
                        switch (response) {
                            case 'Sender IP Address cannot be empty!':
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-blocksender-emptyipaddressnotallowed')}
                                    </Alert>
                                );
                            case `Sender with IP Address ${sender_ip} is already banned!`:
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-blocksender-alreadybanned', { sender_ip: sender_ip })}
                                    </Alert>
                                );
                            case 'Rate-limit exceeded! Try again later.':
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-blocksender-ratelimit')}
                                    </Alert>
                                );
                            case 'Please login again!':
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-pleaseloginagain')}
                                    </Alert>
                                );
                            default:
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-blocksender')}
                                    </Alert>
                                );
                        }
                }
            })()}
        </Snackbar>
    );
};

export default CheckBlockSenderResult;
