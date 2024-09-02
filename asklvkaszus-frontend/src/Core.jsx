import React, { useEffect, useState } from 'react';
import { lazy, Suspense } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { SendFetchUserAppSettingsRequest } from './components/requests/SendFetchUserAppSettingsRequest.jsx';
import { SendFetchAdminAppSettingsRequest } from './admin/components/requests/SendFetchAdminAppSettingsRequest.jsx';

const Home = lazy(() => import("./Home.jsx"))
const Info = lazy(() => import("./Info.jsx"))

const AdminLogin = lazy(() => import("./admin/AdminLogin.jsx"))
const AdminRegister = lazy(() => import("./admin/AdminRegister.jsx"))

const AdminHome = lazy(() => import("./admin/AdminHome.jsx"))
const AdminGlobalSettings = lazy(() => import("./admin/AdminGlobalSettings.jsx"))
const AdminUserSettings = lazy(() => import("./admin/AdminUserSettings.jsx"))
const AdminManagement = lazy(() => import("./admin/AdminManagement.jsx"))

const NotFoundError = lazy(() => import("./components/NotFoundError.jsx"))

import i18n from './components/i18n.jsx';

import SuspenseFallback from './components/SuspenseFallback.jsx';

const Core = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          background: {
            default: prefersDarkMode ? '#000000' : '#ffffff',
            paper: prefersDarkMode ? '#000000' : '#ffffff',
          },
          primary: {
            main: prefersDarkMode ? '#ffffff' : '#000000',
          },
        },
        components: {
          MuiTypography: {
            styleOverrides: {
              h1: {
                fontSize: '24px',
                fontWeight: '700',
              },
              h6: {
                fontSize: '12px',
                fontWeight: '300'
              }
            }
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: '10px',
              }
            }
          },
          MuiSvgIcon: {
            styleOverrides: {
              root: {
                margin: '4px 2px',
                padding: '2px'
              }
            }
          },

          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                marginTop: '5px',
                marginBottom: '5px',
                backgroundColor: prefersDarkMode ? '#202020' : '#f1f1f1',
                color: prefersDarkMode ? '#f1f1f1' : '#202020',
                '&:hover': {
                  backgroundColor: prefersDarkMode ? '#333333' : '#e0e0e0',
                  color: prefersDarkMode ? '#ffffff' : '#000000',
                },
              },
            },
          },

          MuiAlert: {
            styleOverrides: {
              root: {
                fontSize: '16px',
              }
            }
          },

          MuiTableCell: {
            styleOverrides: {
              root: {
                padding: '16px 8px',
              }
            }
          }
        },
      }));

      const [isUserAppSettingsNotificationOpen, setUserAppSettingsNotificationOpen] = useState(false);

      const { userAppSettingsError, userAppSettingsResponse, handleFetchUserAppSettingsRequest } = SendFetchUserAppSettingsRequest();

      useEffect(() => {
        if (userAppSettingsError) {
          setUserAppSettingsNotificationOpen(true);
        }
      }, [userAppSettingsError])

      useEffect(() => {
        handleFetchUserAppSettingsRequest();
      }, [])

      const handleUserAppSettingsNotificationClose = () => {
        setUserAppSettingsNotificationOpen(false);
      }

      const [isAdminAppSettingsNotificationOpen, setAdminAppSettingsNotificationOpen] = useState(false);
      const [forceAdminAppSettingsDataFetch, setForceAdminAppSettingsDataFetch] = useState(false);

      const { adminAppSettingsError, adminAppSettingsResponse, handleFetchAdminAppSettingsRequest } = SendFetchAdminAppSettingsRequest();

      useEffect(() => {
        if (adminAppSettingsError) {
          setAdminAppSettingsNotificationOpen(true);
        }
      }, [adminAppSettingsError])

      useEffect(() => {
        if (forceAdminAppSettingsDataFetch) {
          handleFetchAdminAppSettingsRequest();

        } else {
          handleFetchAdminAppSettingsRequest();
        }
      }, [forceAdminAppSettingsDataFetch])

      const handleAdminAppSettingsNotificationClose = () => {
        setAdminAppSettingsNotificationOpen(false);
      }

      const handleAdminAppSettingsUpdate = () => {
        setForceAdminAppSettingsDataFetch((prev) => !prev);
      };

      const [updateChecks, setUpdateChecks] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <I18nextProvider i18n={i18n}>
        <Router>
          <Suspense fallback={<SuspenseFallback />}>
            <Routes>

              {/* User Panel Routes */}

              <Route exact path="/" element={<Home isUserAppSettingsNotificationOpen={isUserAppSettingsNotificationOpen} userAppSettingsError={userAppSettingsError} userAppSettingsResponse={userAppSettingsResponse} handleUserAppSettingsNotificationClose={handleUserAppSettingsNotificationClose} />} />
              <Route path="/info" element={ <Info /> } />

              {/* User Panel Routes */}



              {/* Admin Panel Routes */}

              <Route path="/admin/login" element={ <AdminLogin /> } />
              <Route path="/admin/register" element={ <AdminRegister /> } />


              <Route exact path="/admin" element={ <AdminHome isAdminAppSettingsNotificationOpen={isAdminAppSettingsNotificationOpen} adminAppSettingsError={adminAppSettingsError} adminAppSettingsResponse={adminAppSettingsResponse} handleAdminAppSettingsNotificationClose={handleAdminAppSettingsNotificationClose} updateChecks={updateChecks} setUpdateChecks={setUpdateChecks} /> } />
              <Route exact path="/admin/home" element={ <AdminHome isAdminAppSettingsNotificationOpen={isAdminAppSettingsNotificationOpen} adminAppSettingsError={adminAppSettingsError} adminAppSettingsResponse={adminAppSettingsResponse} handleAdminAppSettingsNotificationClose={handleAdminAppSettingsNotificationClose} updateChecks={updateChecks} setUpdateChecks={setUpdateChecks} /> } />

              <Route path="/admin/global_settings" element={ <AdminGlobalSettings isAdminAppSettingsNotificationOpen={isAdminAppSettingsNotificationOpen} adminAppSettingsError={adminAppSettingsError} adminAppSettingsResponse={adminAppSettingsResponse} handleAdminAppSettingsNotificationClose={handleAdminAppSettingsNotificationClose} handleForceAdminAppSettingsDataFetch={handleAdminAppSettingsUpdate} updateChecks={updateChecks} setUpdateChecks={setUpdateChecks} /> } />

              <Route path="/admin/user_settings" element={ <AdminUserSettings isAdminAppSettingsNotificationOpen={isAdminAppSettingsNotificationOpen} adminAppSettingsError={adminAppSettingsError} adminAppSettingsResponse={adminAppSettingsResponse} handleAdminAppSettingsNotificationClose={handleAdminAppSettingsNotificationClose} updateChecks={updateChecks} setUpdateChecks={setUpdateChecks} /> } />

              <Route path="/admin/management" element={ <AdminManagement isAdminAppSettingsNotificationOpen={isAdminAppSettingsNotificationOpen} adminAppSettingsError={adminAppSettingsError} adminAppSettingsResponse={adminAppSettingsResponse} handleAdminAppSettingsNotificationClose={handleAdminAppSettingsNotificationClose} updateChecks={updateChecks} setUpdateChecks={setUpdateChecks} /> } />

              {/* Admin Panel Routes */}


              <Route path="*" element={<NotFoundError />} />
            </Routes>
          </Suspense>
        </Router>
      </I18nextProvider>
    </ThemeProvider>
  );
};

export default Core;
