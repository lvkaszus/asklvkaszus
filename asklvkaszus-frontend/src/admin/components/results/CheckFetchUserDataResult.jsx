import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckFetchUserDataResult = ({ open, error, response, onClose }) => {
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
                    case true:
                        switch (response) {
                            case "No username was provided!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-userdata-nousername')}
                                    </Alert>
                                );
                            case "Rate-limit exceeded! Try again later.":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-userdata-ratelimit')}
                                    </Alert>
                                );
                            default:
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-userdata')}
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

export default CheckFetchUserDataResult;
