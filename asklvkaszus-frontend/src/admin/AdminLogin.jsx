import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import PreAuthNavbar from "./components/navbar/PreAuthNavbar";
import { Card, CardContent, Typography, Button, Box, Divider, LinearProgress, TextField } from "@mui/material";
import { Person, Lock, Login, PersonAdd } from "@mui/icons-material";
import RecoverPasswordDescription from "./components/login/RecoverPasswordDescription";
import { SendLoginRequest } from "./components/requests/SendLoginRequest";
import CheckLoginResult from "./components/results/CheckLoginResult";
import { SendCheckSessionRequest } from "./components/requests/SendCheckSessionRequest";
import { SendRegistrationEnabledRequest } from "./components/requests/SendRegistrationEnabledRequest";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

const AdminLogin = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Using `document.title` here, because <title> HTML tag in React 19 don't work with JavaScript variables.
    document.title = `${t('login-pagetitle')} - Ask ${yourNickname}!`;
  }, [yourNickname]);

  const [isLoading, setLoading] = useState(true);

  const [isRecoverPasswordDialogOpen, setRecoverPasswordDialogOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  const validateUsername = (username) => {
    if (username.length > 32) {
      setUsernameError(t('login-username-toomuchusernamecharacters'));
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setUsernameError(t('login-username-forbiddenusernamecharacters'));
    } else if (/(-{2,}|_{2,})/.test(username)) {
      setUsernameError(t('login-username-consecutivecharacters'));
    } else {
      setUsernameError('');
    }
  };

  const validatePassword = (password) => {
    if (password.length > 100) {
      setPasswordError(t('login-password-toomuchpasswordcharacters'));
    } else if (!/^[a-zA-Z0-9!@#$%^&*]+$/.test(password)) {
      setPasswordError(t('login-password-forbiddencharacters'));
    } else {
      setPasswordError('');
    }
  };

  useEffect(() => {
    if (usernameError || passwordError) {
      setButtonDisabled(true);

    } else {
      setButtonDisabled(false);

    }
  }, [username, password]);

  const { loginError, loginResponse, handleLoginRequest } = SendLoginRequest(username, password);

  const handleUsernameValue = (event) => {
    setUsername(event.target.value);
  };
  
  const handlePasswordValue = (event) => {
    setPassword(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setButtonDisabled(true);
    await handleLoginRequest();
    setUsername('');
    setPassword('');
    setSubmitNotificationOpen(true);
    setButtonDisabled(false);
  };

  const handleRecoverPasswordDialogOpen = () => {
    setRecoverPasswordDialogOpen(true);
  };
  
  const handleRecoverPasswordDialogClose = () => {
    setRecoverPasswordDialogOpen(false);
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
                <Typography variant='h5' component='h5'>{t('login-hello')}</Typography>
                <Typography component='p' sx={{ fontSize: '14px' }}>{t('login-description')}</Typography>

                <Box component='form' onSubmit={handleFormSubmit}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '32px' }}>
                    <Person />
                    <TextField
                      id="username"
                      name="username"
                      autoComplete="username"
                      placeholder={t('login-username')}
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
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="password"
                      placeholder={t('login-password')}
                      value={password}
                      onChange={(e) => {
                        handlePasswordValue(e);
                        validatePassword(e.target.value);
                      }}
                      error={!!passwordError}
                      helperText={passwordError}
                      sx={{ marginLeft: '8px' }}
                      variant="standard"
                      fullWidth
                    />
                  </Box>

                  {!registrationEnabledResponse && (
                    <Link to='#' css={css({ textDecoration: 'underline', float: 'right', fontWeight: 300 })} onClick={handleRecoverPasswordDialogOpen}>
                      {t('login-recoverpassword')}
                    </Link>
                  )}

                  <Button variant='outlined' type='submit' disabled={isButtonDisabled} fullWidth>
                    <Login />
                    {t('login-login')}
                  </Button>
                </Box>

                {registrationEnabledResponse && (
                  <Link to='/admin/register'>
                    <Button fullWidth>
                      <PersonAdd />
                      {t('login-register')}
                    </Button>
                  </Link>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <RecoverPasswordDescription open={isRecoverPasswordDialogOpen} onClose={handleRecoverPasswordDialogClose} />

        <CheckLoginResult open={isSubmitNotificationOpen} error={loginError} response={loginResponse} onClose={handleSubmitNotificationClose}/>
      </Box>
    </Box>
  )
}

export default AdminLogin
