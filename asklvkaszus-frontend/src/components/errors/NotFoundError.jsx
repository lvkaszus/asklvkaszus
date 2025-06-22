import React, { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Divider, Typography } from "@mui/material";

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

const NotFoundError = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Using `document.title` here, because <title> HTML tag in React 19 don't work with JavaScript variables.
    document.title = `${t('notfound-pagetitle')} - Ask ${yourNickname}!`;
  }, [yourNickname]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Box sx={{ padding: '8px' }}>
        <title>Nie znaleziono! - Ask {yourNickname}!</title>

        <Card variant="outlined">
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant='h1' component='h1'>{t('error-notfound-title')}</Typography>

            <Divider sx={{ marginY: 2 }} />

            <Typography  component='p'>{t('error-notfound-description')}</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default NotFoundError;
