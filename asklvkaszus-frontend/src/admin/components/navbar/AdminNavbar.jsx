import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import { AdminPanelSettings, Home, Logout, ManageAccounts, Settings } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SendLogout } from '../requests/SendLogoutRequest';
import CheckLogoutResult from '../results/CheckLogoutResult';

const AdminNavbar = ({ displayName }) => {
  const { t } = useTranslation();

  const [anchorElNav, setAnchorElNav] = useState(null);

  const [isLogoutNotificationOpen, setLogoutNotificationOpen] = useState(false);

  const { logoutError, logoutResponse, handleLogoutRequest } = SendLogout();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogoutButton = async () => {
    await handleLogoutRequest();
    setLogoutNotificationOpen(true);
  }

  const handleLogoutNotificationClose = () => {
    setLogoutNotificationOpen(false);
  };

  return (
    <AppBar position="fixed" color='text' sx={{ backgroundImage: 'inherit' }}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', lg: 'none' } }}>
            <IconButton size="large" aria-label={t('navbar-label-useraccount')} aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>

            <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'left' }} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} sx={{ display: { xs: 'block', lg: 'none' } }}>

              <NavLink exact="true" to="/admin/home">
                <MenuItem onClick={handleCloseNavMenu}>
                  <Home />
                  <Typography textAlign="center">{t('admin-navbar-home')}</Typography>
                </MenuItem>
              </NavLink>

              <NavLink to="/admin/global_settings">
                <MenuItem onClick={handleCloseNavMenu}>
                  <Settings />
                  <Typography textAlign="center">{t('admin-navbar-globalsettings')}</Typography>
                </MenuItem>
              </NavLink>

              <NavLink to="/admin/user_settings">
                <MenuItem onClick={handleCloseNavMenu}>
                  <ManageAccounts />
                  <Typography textAlign="center">{t('admin-navbar-usersettings')}</Typography>
                </MenuItem>
              </NavLink>

              <NavLink to="/admin/management">
                <MenuItem onClick={handleCloseNavMenu}>
                  <AdminPanelSettings />
                  <Typography textAlign="center">{t('admin-navbar-management')}</Typography>
                </MenuItem>
              </NavLink>
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' } }}>
              <NavLink exact="true" to="/admin/home">
                <MenuItem onClick={handleCloseNavMenu}>
                  <Home />
                  <Typography textAlign="center">
                    {t('admin-navbar-home')}
                  </Typography>
                </MenuItem>
              </NavLink>

              <NavLink to="/admin/global_settings">
                <MenuItem onClick={handleCloseNavMenu}>
                  <Settings />
                  <Typography textAlign="center">
                    {t('admin-navbar-globalsettings')}
                  </Typography>
                </MenuItem>
              </NavLink>

              <NavLink to="/admin/user_settings">
                <MenuItem onClick={handleCloseNavMenu}>
                  <ManageAccounts />
                  <Typography textAlign="center">
                    {t('admin-navbar-usersettings')}
                  </Typography>
                </MenuItem>
              </NavLink>

              <NavLink to="/admin/management">
                <MenuItem onClick={handleCloseNavMenu}>
                  <AdminPanelSettings />
                  <Typography textAlign="center">
                    {t('admin-navbar-management')}
                  </Typography>
                </MenuItem>
              </NavLink>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexGrow: 0 }}>
            {displayName && (
              <Typography variant="subtitle1" component='p' sx={{ marginRight: '8px' }}>{t('admin-navbar-hellouser', { display_name: displayName })}</Typography>
            )}

            <Button variant="outlined" onClick={handleLogoutButton}>
                <Logout />
                <Typography textAlign="center">{t('admin-navbar-logout')}</Typography>
              </Button>
          </Box>
        </Toolbar>
      </Container>

      <CheckLogoutResult open={isLogoutNotificationOpen} error={logoutError} response={logoutResponse} onClose={handleLogoutNotificationClose} />
    </AppBar>
  );
}
export default AdminNavbar;
