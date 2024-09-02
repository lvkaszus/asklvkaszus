import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckAnswerQuestionResult = ({ open, error, response, onClose }) => {
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
                            case 'Your answer has been updated successfully!':
                                return (
                                    <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                        {t('admin-success-answerquestion')}
                                    </Alert>
                                );
                            default:
                                return null;
                        }
                    case true:
                    default:
                        switch (response) {
                            case 'Question with selected ID does not exist.':
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-answerquestion-questiondoesnotexist')}
                                    </Alert>
                                );
                            case 'Rate-limit exceeded! Try again later.':
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-answerquestion-ratelimit')}
                                    </Alert>
                                );
                            case 'Sending question reply failed. Empty replies are not allowed!':
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-answerquestion-emptyreplynotallowed')}
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
                                        {t('admin-error-answerquestion')}
                                    </Alert>
                                );
                        }
                }
            })()}
        </Snackbar>
    );
};

export default CheckAnswerQuestionResult;
