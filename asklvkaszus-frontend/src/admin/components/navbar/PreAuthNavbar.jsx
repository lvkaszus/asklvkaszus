import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PreAuthNavbar = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ marginY: '8px', maxWidth: '450px' }}>
      <NavLink exact="true" to="/">
        <Typography component='p' sx={{ fontFamily: 'Fira Code', fontSize: '14px', textDecoration: 'underline' }}>
          {t('admin-preauthnavbar-backtouserpanel')}
        </Typography>
      </NavLink>
  </Box>
  );
};

export default PreAuthNavbar;