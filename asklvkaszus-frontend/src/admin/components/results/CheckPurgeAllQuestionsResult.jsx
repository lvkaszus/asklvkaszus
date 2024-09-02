import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckPurgeAllQuestionsResult = ({ open, error, response, onClose }) => {
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
                            case "All questions have been successfully purged!":
                                return (
                                    <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                        {t('admin-success-purgeallquestions')}
                                    </Alert>
                                );
                            default:
                                return null;
                        }
                    case true:
                        switch (response) {
                            case "Rate-limit exceeded! Try again later.":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-purgeallquestions-ratelimit')}
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
                                        {t('admin-error-purgeallquestions')}
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

export default CheckPurgeAllQuestionsResult;
