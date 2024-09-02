import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
      <NavLink exact="true" to="/">
        <Typography sx={{ fontFamily: 'Fira Code', fontSize: '14px', textDecoration: 'underline', marginX: '8px' }}>
          {t('navbar-homepage')}
        </Typography>
      </NavLink>

      <NavLink to="/info">
        <Typography sx={{ fontFamily: 'Fira Code', fontSize: '14px', textDecoration: 'underline', marginX: '8px' }}>
          {t('navbar-info')}
        </Typography>
      </NavLink>
  </Box>
  );
};

export default Navbar;