import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar.jsx';
import { Card, CardContent, Typography, Link, Box, List, ListItem } from '@mui/material';
import { SendVersionCheckRequest } from './components/requests/SendVersionCheckRequest.jsx';

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

const Info = () =>{
  const { t } = useTranslation();

  useEffect(() => {
    // Using `document.title` here, because <title> HTML tag in React 19 don't work with JavaScript variables.
    document.title = `${t('info-pagetitle')} - Ask ${yourNickname}!`;
  }, [yourNickname]);

  const { versionLoading, frontendVersion, backendVersion, latestGitVersion, isLatestGitVersion } = SendVersionCheckRequest();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <Box sx={{ padding: '8px' }}>
        <meta name="robots" content="index, follow" />

        <Navbar />

        <Card variant="outlined" sx={{ marginBottom: '16px', maxWidth: '450px' }}>
          <CardContent>
            <Typography variant='h1' component='h1' sx={{ padding: '8px' }}>Ask {yourNickname}!</Typography>
            <Typography component='p'>{t('info-description')}</Typography>

            <Box sx={{ marginY: '32px' }}>
              <Link href="https://github.com/lvkaszus/asklvkaszus" target="_blank" rel="noreferrer noopener">{t('info-sourcecodelink')}</Link>
            </Box>

            <Box sx={{ textAlign: 'left' }}>
              <Typography component='p'>{t('info-authors-title')}:</Typography>

              <List sx={{ padding: 0 }}>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', marginLeft: '16px', paddingLeft: '4px' }}>
                  <Typography component="span">
                    @lvkaszus -{' '}
                  </Typography>
                  <Typography component="span" fontWeight={300}>
                    {t('info-author1-work')}
                  </Typography>
                </ListItem>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', marginLeft: '16px', paddingLeft: '4px' }}>
                  <Typography component="span">
                    {yourNickname} -{' '}
                  </Typography>
                  <Typography component="span" fontWeight={300}>
                    {t('info-author2-work')}
                  </Typography>
                </ListItem>
              </List>
            </Box>

            <Box sx={{ textAlign: 'left' }}>
              <Box sx={{ marginTop: '48px' }}>
                {versionLoading ? (
                  <Typography variant='h6' component='h6'>{t('loading')}</Typography>
                ) : (
                  <>
                    <Typography variant='h6' component='h6'>{t('info-frontendversion')}: {frontendVersion}</Typography>
                    <Typography variant='h6' component='h6'>{t('info-backendversion')}: {backendVersion}</Typography>

                    {!isLatestGitVersion && (
                      <Box>
                        <Typography variant='h6' component='h6' color="aqua">{t('info-newupdateavailable', { new_version: latestGitVersion})}</Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default Info;