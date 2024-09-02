import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import AdminNavbar from "./components/navbar/AdminNavbar";
import { Box, LinearProgress, Typography } from "@mui/material";
import CheckUpdatesResult from "./components/results/CheckUpdatesResult";
import { SendCheckUpdatesRequest } from "./components/requests/SendCheckUpdatesRequest";
import CheckFetchAdminAppSettingsResult from "./components/results/CheckFetchAdminAppSettingsResult";
import UserSettingsList from "./components/user_settings/UserSettingsList";
import { SendFetchUserDataRequest } from "./components/requests/SendFetchUserDataRequest";
import CheckFetchUserDataResult from "./components/results/CheckFetchUserDataResult";
import { SendSetSessionRequest } from "./components/requests/SendSetSessionRequest";

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

const AdminUserSettings = ({ isAdminAppSettingsNotificationOpen, adminAppSettingsError, adminAppSettingsResponse, handleAdminAppSettingsNotificationClose, updateChecks, setUpdateChecks }) => {
    const { t } = useTranslation();

    const [isLoading, setLoading] = useState(true);

    const [isCheckUpdatesNotificationOpen, setCheckUpdatesNotificationOpen] = useState(false);

    const [forceUserDataFetch, setForceUserDataFetch] = useState(false);

    const { sessionUsername, handleSetSessionRequest } = SendSetSessionRequest();

    const { checkUpdatesStatus, checkUpdatesResponse, latestVersion, currentVersion, handleCheckUpdatesRequest } = SendCheckUpdatesRequest();

    const handleRequests = async () => {
      await handleSetSessionRequest();

      if (updateChecks < 1) {
        await handleCheckUpdatesRequest();
        setUpdateChecks(1);
        setCheckUpdatesNotificationOpen(true);
      }

      setLoading(false);
    }

    useEffect(() => {
      handleRequests();
    }, []);

    const handleCheckUpdatesNotificationClose = () => {
      setCheckUpdatesNotificationOpen(false);
    };

    const [isUserDataNotificationOpen, setUserDataNotificationOpen] = useState(false);

    const { userDataError, userDataResponse, handleFetchUserDataRequest } = SendFetchUserDataRequest();
  
    useEffect(() => {
      if (userDataError) {
        setUserDataNotificationOpen(true);
      }
    }, [userDataError])

    useEffect(() => {
      if (forceUserDataFetch) {
        handleFetchUserDataRequest();
      } else {
        handleFetchUserDataRequest();
      }
    }, [forceUserDataFetch])
  
    const handleUserDataUpdate = () => {
      setForceUserDataFetch((prev) => !prev);
    };
  
    const handleUserDataNotificationClose = () => {
      setUserDataNotificationOpen(false);
    };

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
        <Box sx={{ padding: '8px', width: '100%' }}>
          <Helmet>
            <title>{t('admin-usersettings-pagetitle')} - Ask {yourNickname}!</title>

            <meta name="robots" content="noindex, nofollow" />
          </Helmet>

          <AdminNavbar displayName={sessionUsername} />

          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
            {isLoading ? (
              <Box sx={{ minWidth: '300px' }}>
                <Typography component='p'>{t('loading')}</Typography>
                <LinearProgress sx={{ marginTop: '12px', width: '100%' }} />
              </Box>
            ) : (
              <UserSettingsList userData={userDataResponse} handleUserDataUpdate={handleUserDataUpdate} />
            )}
          </Box>

          <CheckFetchAdminAppSettingsResult open={isAdminAppSettingsNotificationOpen} error={adminAppSettingsError} response={adminAppSettingsResponse} onClose={handleAdminAppSettingsNotificationClose} />

          <CheckUpdatesResult open={isCheckUpdatesNotificationOpen} status={checkUpdatesStatus} response={checkUpdatesResponse} latestVersion={latestVersion} currentVersion={currentVersion} onClose={handleCheckUpdatesNotificationClose} />

          <CheckFetchUserDataResult open={isUserDataNotificationOpen} error={userDataError} response={userDataResponse} onClose={handleUserDataNotificationClose} />
        </Box>
      </Box>
    )
}

export default AdminUserSettings
