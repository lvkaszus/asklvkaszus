import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckUpdatesResult = ({ open, status, response, latestVersion, currentVersion, onClose }) => {
    const { t } = useTranslation();

    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            autoHideDuration={5000}
            key={response}
            onClose={onClose}
        >
            {(() => {
                switch (status) {
                    case 'success':
                        if (response === "You are running the latest version.") {
                            return (
                                <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                    {t('admin-success-checkupdates')}
                                </Alert>
                            );
                        }
                        return null;

                    case 'warning':
                        if (response === "A newer version of this application is available. Please upgrade!") {
                            return (
                                <Alert onClose={onClose} severity="warning" sx={{ width: '100%', textAlign: 'left', whiteSpace: 'pre-line' }}>
                                    {t('admin-warning-checkupdates', { current_version: currentVersion, latest_version: latestVersion })}
                                </Alert>
                            );
                        }
                        return null;

                    default:
                        switch (response) {
                            case "Rate-limit exceeded! Try again later.":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-checkupdates-ratelimit')}
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
                                        {t('admin-error-checkupdates')}
                                    </Alert>
                                );
                        }
                }
            })()}
        </Snackbar>
    );
};

export default CheckUpdatesResult;
