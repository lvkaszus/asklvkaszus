import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import PreAuthNavbar from "./components/navbar/PreAuthNavbar";
import { Card, CardContent, Typography, Input, Button, Alert, Box, Divider, LinearProgress } from "@mui/material";
import { Person, Lock, Close, Done, Login, PersonAdd } from "@mui/icons-material";
import { SendRegisterRequest } from "./components/requests/SendRegisterRequest";
import CheckRegisterResult from "./components/results/CheckRegisterResult";
import { Link } from "react-router-dom";
import { SendCheckSessionRequest } from "./components/requests/SendCheckSessionRequest";
import { SendRegistrationEnabledRequest } from "./components/requests/SendRegistrationEnabledRequest";

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

const AdminRegister = () => {
    const { t } = useTranslation();

    const [isLoading, setLoading] = useState(true);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passwordStrength, setPasswordStrength] = useState({
      length: false,
      uppercase: false,
      digit: false,
      specialChar: false,
    });

    const { registerError, registerResponse, handleRegisterRequest } = SendRegisterRequest(username, password, confirmPassword);
    const [isSubmitNotificationOpen, setSubmitNotificationOpen] = useState(false);
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

    const checkPasswordStrength = (value) => {
      const lengthRegex = /^.{12,}$/;
      const uppercaseRegex = /[A-Z]/;
      const digitRegex = /\d/;
      const specialCharRegex = /[!@#$%^&*]/;
  
      setPasswordStrength({
        length: lengthRegex.test(value),
        uppercase: uppercaseRegex.test(value),
        digit: digitRegex.test(value),
        specialChar: specialCharRegex.test(value)
      });
    };

    useEffect(() => {
      checkPasswordStrength(password);
  
      const isAnyPasswordRequirementFalse = Object.values(passwordStrength).some(value => value === false);
      const isNewPasswordEntered = password.length > 0;
      const isConfirmNewPasswordEntered = confirmPassword.length > 0;
      const areNewPasswordsSame = password === confirmPassword;
  
      if (isAnyPasswordRequirementFalse || !isNewPasswordEntered || !isConfirmNewPasswordEntered || !areNewPasswordsSame) {
        setButtonDisabled(true);

      } else {
        setButtonDisabled(false);

      }
  }, [password, confirmPassword]);

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

    const handleFormSubmit = async (event) => {
      event.preventDefault();
      setButtonDisabled(true);
      await handleRegisterRequest();
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
        <Helmet>
          <title>{t('register-pagetitle')} - Ask {yourNickname}!</title>

          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

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

                    <Box component='form' onSubmit={handleFormSubmit}>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '32px' }}>
                        <Person />
                        <Input
                          id="username"
                          name="username"
                          autoComplete="username"
                          placeholder={t('register-username')}
                          value={username}
                          onChange={handleUsernameValue}
                          sx={{ marginLeft: '8px' }}
                          fullWidth
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', marginY: '16px' }}>
                        <Lock />
                        <Input
                          id="password"
                          type="password"
                          name="password"
                          autoComplete="password"
                          placeholder={t('register-password')}
                          value={password}
                          onChange={handlePasswordValue}
                          sx={{ marginLeft: '8px' }}
                          fullWidth
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', marginY: '16px' }}>
                        <Lock />
                        <Input
                          id="confirm-password"
                          type="password"
                          name="password"
                          autoComplete="password"
                          placeholder={t('register-confirmpassword')}
                          value={confirmPassword}
                          onChange={handleConfirmPasswordValue}
                          sx={{ marginLeft: '8px' }}
                          fullWidth
                        />
                      </Box>

                      <Card variant="outlined" sx={{ textAlign: 'left', marginY: '8px' }}>
                        <CardContent>
                          {passwordStrength.length ? (
                            <Typography component='p' color="lightgreen" sx={{ fontWeight: 300 }}>
                              <Done />
                              {t('register-password-length')}
                            </Typography>
                          ) : (
                            <Typography component='p' color="lightcoral" sx={{ fontWeight: 300 }}>
                              <Close />
                              {t('register-password-length')}
                            </Typography>
                          )}

                          {passwordStrength.uppercase ? (
                            <Typography component='p' color="lightgreen" sx={{ fontWeight: 300 }}>
                              <Done />
                              {t('register-password-uppercase')}
                            </Typography>
                          ) : (
                            <Typography component='p' color="lightcoral" sx={{ fontWeight: 300 }}>
                              <Close />
                              {t('register-password-uppercase')}
                            </Typography>
                          )}

                          {passwordStrength.digit ? (
                            <Typography component='p' color="lightgreen" sx={{ fontWeight: 300 }}>
                              <Done />
                              {t('register-password-digit')}
                            </Typography>
                          ) : (
                            <Typography component='p' color="lightcoral" sx={{ fontWeight: 300 }}>
                              <Close />
                              {t('register-password-digit')}
                            </Typography>
                          )}

                          {passwordStrength.specialChar ? (
                            <Typography component='p' color="lightgreen" sx={{ fontWeight: 300 }}>
                              <Done />
                              {t('register-password-specialchar')}
                            </Typography>
                          ) : (
                            <Typography component='p' color="lightcoral" sx={{ fontWeight: 300 }}>
                              <Close />
                              {t('register-password-specialchar')}
                            </Typography>
                          )}

                          {password && confirmPassword ? (
                            password === confirmPassword ? (
                              <Typography component='p' color="lightgreen" sx={{ fontWeight: 300 }}>
                                <Done />
                                {t('register-password-same')}
                              </Typography>
                            ) : (
                              <Typography component='p' color="lightcoral" sx={{ fontWeight: 300 }}>
                                <Close />
                                {t('register-password-same')}
                              </Typography>
                            )
                          ) : (
                            <Typography component='p' color="lightcoral" sx={{ fontWeight: 300 }}>
                              <Close />
                              {t('register-password-nopasswords')}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>

                      <Button type='submit' disabled={isButtonDisabled} fullWidth>
                          <PersonAdd />
                          {t('register-register')}
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Alert severity='error' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>{t('error-register-unavailable')}</Alert>
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

        <CheckRegisterResult open={isSubmitNotificationOpen} error={registerError} response={registerResponse} onClose={handleSubmitNotificationClose}/>
      </Box>
    </Box>
  )
}
  

export default AdminRegister
