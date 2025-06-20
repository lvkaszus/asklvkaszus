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
                            case "Registration successful!":
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
                            case "Invalid JSON payload!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-invalidjsonpayload')}
                                    </Alert>
                                );
                            case "Username, Password and Confirmed Password is required!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-usernamepasswordandconfirmedpasswordrequired')}
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
                            case "Username must be at least 4 characters long!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-toofewusernamecharacters')}
                                    </Alert>
                                );
                            case "Username must be less than 32 characters long!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-toomuchusernamecharacters')}
                                    </Alert>
                                );
                            case "Password must be at least 12 characters long!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-toofewpasswordcharacters')}
                                    </Alert>
                                );
                            case "Password must be less than 100 characters long!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-toomuchpasswordcharacters')}
                                    </Alert>
                                );
                            case "Username may contain only Latin letters (a–z, A–Z), digits (0–9), hyphens (-), and underscores (_)!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-forbiddenusernamecharacters')}
                                    </Alert>
                                );
                            case "Username cannot contain consecutive hyphens (-) or underscores (_)!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-consecutivecharacters')}
                                    </Alert>
                                );
                            case "Password may contain only Latin letters (a–z, A–Z), digits (0–9), and the following special characters: !, @, #, $, %, ^, &, *!":
                                return (
                                    <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
                                        {t('admin-error-register-forbiddenpasswordcharacters')}
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
