import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';

const CheckUpdateCaptchaSettingsResult = ({ open, error, response, onClose }) => {
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
                        case "CAPTCHA Settings have been updated.":
                            return (
                                <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                    {t('admin-success-updatecaptchasettings')}
                                </Alert>
                            );
                        default:
                            return null;
                    }
                } else {
                    switch (response) {
                        case "Invalid JSON payload!":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-updatecaptchasettings-invalidjsonpayload')}
                                </Alert>
                            );
                        case "captcha_enabled must be boolean!":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-updatecaptchasettings-inputvarmustbeabool', { input_var: 'captcha_enabled' })}
                                </Alert>
                            );
                        case "All CAPTCHA fields are required when enabling!":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-updatecaptchasettings-missingfields')}
                                </Alert>
                            );
                        case "Unsupported CAPTCHA Provider!":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-updatecaptchasettings-unsupportedprovider')}
                                </Alert>
                            );
                        case "captcha_provider must be string!":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-updatecaptchasettings-inputvarmustbeastring', { input_var: 'captcha_provider' })}
                                </Alert>
                            );
                        case "captcha_site_key cannot be empty!":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-updatecaptchasettings-sitekeyempty')}
                                </Alert>
                            );
                        case "captcha_secret_key cannot be empty!":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-updatecaptchasettings-secretkeyempty')}
                                </Alert>
                            );
                        case "Rate-limit exceeded! Try again later.":
                            return (
                                <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                    {t('admin-error-updatecaptchasettings-ratelimit')}
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
                                    {t('admin-error-updatecaptchasettings')}
                                </Alert>
                            );
                    }
                }
            })()}
        </Snackbar>
    );
};

export default CheckUpdateCaptchaSettingsResult;
