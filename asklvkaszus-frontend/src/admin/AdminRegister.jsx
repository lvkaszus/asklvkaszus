import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PreAuthNavbar from "./components/navbar/PreAuthNavbar";
import { useTheme, Card, CardContent, Typography, Button, Alert, Box, Divider, LinearProgress, TextField } from "@mui/material";
import { Person, Lock, Close, Done, Login, PersonAdd } from "@mui/icons-material";
import { SendRegisterRequest } from "./components/requests/SendRegisterRequest";
import CheckRegisterResult from "./components/results/CheckRegisterResult";
import { Link } from "react-router-dom";
import { SendCheckSessionRequest } from "./components/requests/SendCheckSessionRequest";
import { SendRegistrationEnabledRequest } from "./components/requests/SendRegistrationEnabledRequest";
import CheckFetchAdminAppSettingsResult from "./components/results/CheckFetchAdminAppSettingsResult";
import CaptchaDialog from "../components/captcha/CaptchaDialog";

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

const AdminRegister = ({ handleFetchAdminAppSettingsRequest, isAdminAppSettingsNotificationOpen, adminAppSettingsError, adminAppSettingsResponse, handleAdminAppSettingsNotificationClose }) => {
    const theme = useTheme();

    const { t } = useTranslation();

    useEffect(() => {
      // Using `document.title` here, because <title> HTML tag in React 19 don't work with JavaScript variables.
      document.title = `${t('register-pagetitle')} - Ask ${yourNickname}!`;
    }, [yourNickname]);

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
      if (!adminAppSettingsError) {
        handleFetchAdminAppSettingsRequest();
      }
    }, [adminAppSettingsError])

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [usernameError, setUsernameError] = useState('');

    const [passwordStrength, setPasswordStrength] = useState({
      length: false,
      uppercase: false,
      digit: false,
      specialChar: false,
      allowedChars: false
    });

    const { registerError, registerResponse, handleRegisterRequest } = SendRegisterRequest(username, password, confirmPassword);
    const [isSubmitNotificationOpen, setSubmitNotificationOpen] = useState(false);

    const [isCaptchaDialogOpen, setCaptchaDialogOpen] = useState(false);

    const [isButtonDisabled, setButtonDisabled] = useState(false);
    
    const { handleCheckSessionRequest } = SendCheckSessionRequest();

    const { registrationEnabledResponse, handleRegistrationInfoRequest } = SendRegistrationEnabledRequest();
  
    const handleRequests = async () => {
      await handleCheckSessionRequest();
      await handleRegistrationInfoRequest();

      setLoading(false);
    }
    
    useEffect(() => {
      handleRequests();
    }, []);

    const validateUsername = (username) => {
      if (username.length < 4) {
        setUsernameError(t('register-username-toofewusernamecharacters'));
      } else if (username.length > 32) {
        setUsernameError(t('register-username-toomuchusernamecharacters'));
      } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        setUsernameError(t('register-username-forbiddenusernamecharacters'));
      } else if (/(-{2,}|_{2,})/.test(username)) {
        setUsernameError(t('register-username-consecutivecharacters'));
      } else {
        setUsernameError('');
      }
    };

    const checkPasswordStrength = (value) => {
      const lengthRegex = /^.{12,}$/;
      const uppercaseRegex = /[A-Z]/;
      const digitRegex = /\d/;
      const specialCharRegex = /[!@#$%^&*]/;
      const allowedCharsRegex = /^[a-zA-Z0-9!@#$%^&*]+$/;
  
      setPasswordStrength({
        length: lengthRegex.test(value),
        uppercase: uppercaseRegex.test(value),
        digit: digitRegex.test(value),
        specialChar: specialCharRegex.test(value),
        allowedChars: allowedCharsRegex.test(value)
      });
    };

    useEffect(() => {
      checkPasswordStrength(password);
  
      const isAnyPasswordRequirementFalse = Object.values(passwordStrength).some(value => value === false);
      const isNewPasswordEntered = password.length > 0;
      const isConfirmNewPasswordEntered = confirmPassword.length > 0;
      const areNewPasswordsSame = password === confirmPassword;
  
      if (isAnyPasswordRequirementFalse || !isNewPasswordEntered || !isConfirmNewPasswordEntered || !areNewPasswordsSame || usernameError) {
        setButtonDisabled(true);

      } else {
        setButtonDisabled(false);

      }
  }, [username, password, confirmPassword]);

    const handleUsernameValue = (event) => {
      setUsername(event.target.value);
    };

    const handlePasswordValue = (event) => {
        setPassword(event.target.value);
        checkPasswordStrength(event.target.value);
    };

    const handleConfirmPasswordValue = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleCaptchaDialogOpen = () => {
      setCaptchaDialogOpen(true);
    }

    const handleCaptchaDialogClose = () => {
      setCaptchaDialogOpen(false);
    }

  const handleRegisterFormSubmit = async (event) => {
    event.preventDefault();

    if (adminAppSettingsResponse?.captcha_enabled) {
      handleCaptchaDialogOpen();
    } else {
      await handleRegister(null);
    }
  }

    const handleRegister = async (captcha_token) => {
      setButtonDisabled(true);
      await handleRegisterRequest(captcha_token);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setSubmitNotificationOpen(true);
      setButtonDisabled(false);
    };

    const handleSubmitNotificationClose = () => {
      setSubmitNotificationOpen(false);
    };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <Box sx={{ padding: '8px' }}>
        <meta name="robots" content="noindex, nofollow" />

        <PreAuthNavbar />
  
        <Card variant="outlined" sx={{ marginBottom: '16px', maxWidth: '450px' }}>
          <CardContent>
            <Typography variant='h1' component='h1' sx={{ padding: '8px' }}>Ask {yourNickname}!</Typography>
            <Typography component='p'>{t('adminpanel')}</Typography>

            <Divider sx={{ marginY: '16px' }} />

            {isLoading ? (
              <Box sx={{ marginTop: '8px', minWidth: '300px' }}>
                <Typography component='p'>{t('loading')}</Typography>
                <LinearProgress sx={{ marginTop: '12px', width: '100%' }} />
              </Box>
            ) : (
              <>
                {registrationEnabledResponse ? (
                  <>
                    <Typography variant='h5' component='h5'>{t('register-hello')}</Typography>
                    <Typography component='p' sx={{ fontSize: '14px' }}>{t('register-description')}</Typography>

                    <Box component='form' onSubmit={handleRegisterFormSubmit}>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '32px' }}>
                        <Person />
                        <TextField
                          id="username"
                          name="username"
                          autoComplete="username"
                          placeholder={t('register-username')}
                          value={username}
                          onChange={(e) => {
                            handleUsernameValue(e);
                            validateUsername(e.target.value);
                          }}
                          error={!!usernameError}
                          helperText={usernameError}
                          sx={{ marginLeft: '8px' }}
                          variant="standard"
                          fullWidth
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', marginY: '16px' }}>
                        <Lock />
                        <TextField
                          id="password"
                          type="password"
                          name="password"
                          autoComplete="password"
                          placeholder={t('register-password')}
                          value={password}
                          onChange={handlePasswordValue}
                          sx={{ marginLeft: '8px' }}
                          variant="standard"
                          fullWidth
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', marginY: '16px' }}>
                        <Lock />
                        <TextField
                          id="confirm-password"
                          type="password"
                          name="password"
                          autoComplete="password"
                          placeholder={t('register-confirmpassword')}
                          value={confirmPassword}
                          onChange={handleConfirmPasswordValue}
                          sx={{ marginLeft: '8px' }}
                          variant="standard"
                          fullWidth
                        />
                      </Box>

                      <Card variant="outlined" sx={{ textAlign: 'left', marginY: '8px' }}>
                        <CardContent>
                          {passwordStrength.allowedChars ? (
                            <Typography
                              component='p'
                              sx={{
                                color: theme.palette.mode === 'dark'
                                  ? theme.palette.success.light
                                  : theme.palette.success.main
                              }}
                            >
                              <Done />
                              {t('register-password-allowedchars')}
                            </Typography>
                          ) : (
                            <Typography
                              component='p'
                              sx={{
                                color: theme.palette.mode === 'dark'
                                  ? theme.palette.error.light
                                  : theme.palette.error.main
                              }}
                            >
                              <Close />
                              {t('register-password-allowedchars')}
                            </Typography>
                          )}

                          {passwordStrength.length ? (
                            <Typography
                              component='p'
                              sx={{
                                color: theme.palette.mode === 'dark'
                                  ? theme.palette.success.light
                                  : theme.palette.success.main
                              }}
                            >
                              <Done />
                              {t('register-password-length')}
                            </Typography>
                          ) : (
                            <Typography
                              component='p'
                              sx={{
                                color: theme.palette.mode === 'dark'
                                  ? theme.palette.error.light
                                  : theme.palette.error.main
                              }}
                            >
                              <Close />
                              {t('register-password-length')}
                            </Typography>
                          )}

                          {passwordStrength.uppercase ? (
                            <Typography
                              component='p'
                              sx={{
                                color: theme.palette.mode === 'dark'
                                  ? theme.palette.success.light
                                  : theme.palette.success.main
                              }}
                            >
                              <Done />
                              {t('register-password-uppercase')}
                            </Typography>
                          ) : (
                            <Typography
                              component='p'
                              sx={{
                                color: theme.palette.mode === 'dark'
                                  ? theme.palette.error.light
                                  : theme.palette.error.main
                              }}
                            >
                              <Close />
                              {t('register-password-uppercase')}
                            </Typography>
                          )}

                          {passwordStrength.digit ? (
                            <Typography
                              component='p'
                              sx={{
                                color: theme.palette.mode === 'dark'
                                  ? theme.palette.success.light
                                  : theme.palette.success.main
                              }}
                            >
                              <Done />
                              {t('register-password-digit')}
                            </Typography>
                          ) : (
                            <Typography
                              component='p'
                              sx={{
                                color: theme.palette.mode === 'dark'
                                  ? theme.palette.error.light
                                  : theme.palette.error.main
                              }}
                            >
                              <Close />
                              {t('register-password-digit')}
                            </Typography>
                          )}

                          {passwordStrength.specialChar ? (
                            <Typography
                              component='p'
                              sx={{
                                color: theme.palette.mode === 'dark'
                                  ? theme.palette.success.light
                                  : theme.palette.success.main
                              }}
                            >
                              <Done />
                              {t('register-password-specialchar')}
                            </Typography>
                          ) : (
                            <Typography
                              component='p'
                              sx={{
                                color: theme.palette.mode === 'dark'
                                  ? theme.palette.error.light
                                  : theme.palette.error.main
                              }}
                            >
                              <Close />
                              {t('register-password-specialchar')}
                            </Typography>
                          )}

                          {password && confirmPassword ? (
                            password === confirmPassword ? (
                            <Typography
                              component='p'
                              sx={{
                                color: theme.palette.mode === 'dark'
                                  ? theme.palette.success.light
                                  : theme.palette.success.main
                              }}
                            >
                                <Done />
                                {t('register-password-same')}
                              </Typography>
                            ) : (
                            <Typography
                              component='p'
                              sx={{
                                color: theme.palette.mode === 'dark'
                                  ? theme.palette.error.light
                                  : theme.palette.error.main
                              }}
                            >
                                <Close />
                                {t('register-password-same')}
                              </Typography>
                            )
                          ) : (
                            <Typography
                              component='p'
                              sx={{
                                color: theme.palette.mode === 'dark'
                                  ? theme.palette.error.light
                                  : theme.palette.error.main
                              }}
                            >
                              <Close />
                              {t('register-password-nopasswords')}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>

                      <Button variant='outlined' type='submit' disabled={isButtonDisabled} fullWidth>
                          <PersonAdd />
                          {t('register-register')}
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Alert severity='error' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>{t('admin-error-register-nonewusers')}</Alert>
                )}

                <Link to='/admin/login'>
                  <Button fullWidth>
                    <Login />
                    {t('register-backtologin')}
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        <CheckFetchAdminAppSettingsResult open={isAdminAppSettingsNotificationOpen} error={adminAppSettingsError} response={adminAppSettingsResponse} onClose={handleAdminAppSettingsNotificationClose} />

        <CaptchaDialog open={isCaptchaDialogOpen} onClose={handleCaptchaDialogClose} onVerify={(token) => {handleCaptchaDialogClose(); handleRegister(token)}} captchaProvider={adminAppSettingsResponse?.captcha_provider} captchaSiteKey={adminAppSettingsResponse?.captcha_site_key} />

        <CheckRegisterResult open={isSubmitNotificationOpen} error={registerError} response={registerResponse} onClose={handleSubmitNotificationClose}/>
      </Box>
    </Box>
  )
}
  

export default AdminRegister
