import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

const CheckAdminApiKeyCopyResult = ({ open, error, onClose }) => {
    const { t } = useTranslation();

    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            sx={{ marginTop: '60px' }}
            autoHideDuration={5000}
            key="Copy Admin API Key"
            onClose={onClose}
        >
            {(() => {
                switch (error) {
                    case false:
                        return (
                            <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                {t('admin-success-copyadminapikey')}
                            </Alert>
                        );
                    case true:
                        return (
                            <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                {t('admin-error-copyadminapikey')}
                            </Alert>
                        );
                    default:
                        return null;
                }
            })()}
        </Snackbar>
    );
};

export default CheckAdminApiKeyCopyResult;
