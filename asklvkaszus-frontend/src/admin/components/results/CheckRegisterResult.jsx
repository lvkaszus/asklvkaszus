import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Alert } from '@mui/material';


const CheckRegisterResult = ({ open, error, response, onClose }) => {
    const { t } = useTranslation();

    return (
        <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} autoHideDuration={5000} key={response} onClose={onClose}>
            {(() => {
                switch (true) {
                    case !error:
                        switch (response) {
                            case "Registration successful.":
                                return (
                                    <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
                                        {t('admin-success-register')}
                                    </Alert>
                                );
                            default:
                                return null;
                        }

                    case error:
                        switch (response) {
                            case "Registration for new users is not allowed!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-nonewusers')}
                                    </Alert>
                                );
                            case "Password must be at least 12 characters long!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-toofewcharacters')}
                                    </Alert>
                                );
                            case "Password must contain at least one uppercase letter!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-nouppercase')}
                                    </Alert>
                                );
                            case "Password must contain at least one number!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-nodigit')}
                                    </Alert>
                                );
                            case "Password must contain at least one special character like: !, @, #, $, %, ^, &, *!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-nospecial')}
                                    </Alert>
                                );
                            case "Confirmed password is not the same as password!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-nomatch')}
                                    </Alert>
                                );
                            case "This username is not allowed! Please try again with another username.":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-usernamedenied')}
                                    </Alert>
                                );
                            case "User with this username already exists.":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-userexists')}
                                    </Alert>
                                );
                            case "Rate-limit exceeded! Try again later.":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-ratelimit')}
                                    </Alert>
                                );
                            default:
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register')}
                                    </Alert>
                                );
                        }

                    default:
                        return null;
                }
            })()}
        </Snackbar>

    )
}

export default CheckRegisterResult
