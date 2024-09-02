import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import PreAuthNavbar from "./components/navbar/PreAuthNavbar";
import { Card, CardContent, Typography, Input, Button, Box, Divider, LinearProgress } from "@mui/material";
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

  const [isLoading, setLoading] = useState(true);

  const [isRecoverPasswordDialogOpen, setRecoverPasswordDialogOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
        <Helmet>
          <title>{t('login-pagetitle')} - Ask {yourNickname}!</title>

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
                <Typography variant='h5' component='h5'>{t('login-hello')}</Typography>
                <Typography component='p' sx={{ fontSize: '14px' }}>{t('login-description')}</Typography>

                <Box component='form' onSubmit={handleFormSubmit}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '32px' }}>
                    <Person />
                    <Input
                      id="username"
                      name="username"
                      autoComplete="username"
                      placeholder={t('login-username')}
                      value={username}
                      onChange={handleUsernameValue}
                      sx={{ marginLeft: '8px' }}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginY: '16px' }}>
                    <Lock />
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="password"
                      placeholder={t('login-password')}
                      value={password}
                      onChange={handlePasswordValue}
                      sx={{ marginLeft: '8px' }}
                      fullWidth
                    />
                  </Box>

                  {!registrationEnabledResponse && (
                    <Link to='#' css={css({ textDecoration: 'underline', float: 'right', fontWeight: 300 })} onClick={handleRecoverPasswordDialogOpen}>
                      {t('login-recoverpassword')}
                    </Link>
                  )}

                  <Button type='submit' disabled={isButtonDisabled} fullWidth>
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
