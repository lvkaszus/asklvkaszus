import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckFetchUserAppSettingsResult = ({ open, error, response, onClose }) => {
    const { t } = useTranslation();

    return (
        <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} sx={{ marginTop: '60px' }} autoHideDuration={5000} key={response} onClose={onClose}>
            {(() => {
                switch (error) {
                    case true:
                    default:
                        switch (response) {
                            case 'App Settings are not set yet!':
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('error-fetchuserappsettings-notset')}
                                    </Alert>
                                );
                            case 'Rate-limit exceeded! Try again later.':
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('error-fetchuserappsettings-ratelimit')}
                                    </Alert>
                                );
                            default:
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('error-fetchuserappsettings')}
                                    </Alert>
                                );
                        }
                }
            })()}
        </Snackbar>
    );
};

export default CheckFetchUserAppSettingsResult;
