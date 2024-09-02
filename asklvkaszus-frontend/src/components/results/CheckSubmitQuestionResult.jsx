import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Backdrop } from '@mui/material';

const CheckSubmitQuestionResult = ({ open, error, response, onClose }) => {
    const { t } = useTranslation();

    return (
        <Backdrop open={open} onClick={onClose} sx={{ padding: '8px', backgroundColor: 'rgb(0, 0, 0, 0.8)', zIndex: 9999, textAlign: 'center' }}>
            {(() => {
                switch (error) {
                    case false:
                        switch (response) {
                            case 'Your message has been sent successfully!':
                                return (
                                    <Alert severity='success' onClose={onClose} sx={{ display: 'flex', alignItems: 'center' }}>
                                        {t('success-submitquestion')}
                                    </Alert>
                                );
                            case 'Your message has been sent successfully, but administrator needs to approve it before it will be visible!':
                                return (
                                    <Alert severity='success' onClose={onClose} sx={{ display: 'flex', alignItems: 'center' }}>
                                        {t('success-submitquestion-approvalenabled')}
                                    </Alert>
                                );
                            default:
                                return null;
                        }
                    case true:
                    default:
                        switch (response) {
                            case 'Sending question failed. Empty messages are not allowed!':
                                return (
                                    <Alert severity='error' onClose={onClose} sx={{ display: 'flex', alignItems: 'center' }}>
                                        {t('error-submitquestion-empty')}
                                    </Alert>
                                );
                            case 'Sending question failed. You have been blocked!':
                                return (
                                    <Alert severity='error' onClose={onClose} sx={{ display: 'flex', alignItems: 'center' }}>
                                        {t('error-submitquestion-blocked')}
                                    </Alert>
                                );
                            case 'Rate-limit exceeded! Try again later.':
                                return (
                                    <Alert severity='error' onClose={onClose} sx={{ display: 'flex', alignItems: 'center' }}>
                                        {t('error-submitquestion-ratelimit')}
                                    </Alert>
                                );
                            default:
                                return (
                                    <Alert severity='error' onClose={onClose} sx={{ display: 'flex', alignItems: 'center' }}>
                                        {t('error-submitquestion')}
                                    </Alert>
                                );
                        }
                }
            })()}
        </Backdrop>
    );
};

export default CheckSubmitQuestionResult;
