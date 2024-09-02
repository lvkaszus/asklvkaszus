import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckToggleQuestionVisibilityResult = ({ open, error, response, onClose }) => {
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
                        case "Question is now visible.":
                            return (
                                <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                    {t('admin-success-togglequestionvisibility-visible')}
                                </Alert>
                            );
                        case "Question is now hidden.":
                            return (
                                <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                    {t('admin-success-togglequestionvisibility-hidden')}
                                </Alert>
                            );
                        default:
                            return null;
                    }
                } else {
                    switch (response) {
                        case "Question with selected ID does not exist.":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-togglequestionvisibility-questiondoesnotexist')}
                                </Alert>
                            );
                        case "Rate-limit exceeded! Try again later.":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-togglequestionvisibility-ratelimit')}
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
                                    {t('admin-error-togglequestionvisibility')}
                                </Alert>
                            );
                    }
                }
            })()}
        </Snackbar>
    );
};

export default CheckToggleQuestionVisibilityResult;
