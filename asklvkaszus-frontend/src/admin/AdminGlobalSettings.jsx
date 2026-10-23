import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import AdminNavbar from "./components/navbar/AdminNavbar";
import { Box, LinearProgress, Typography } from "@mui/material";
import CheckUpdatesResult from "./components/results/CheckUpdatesResult";
import { SendCheckUpdatesRequest } from "./components/requests/SendCheckUpdatesRequest";
import CheckFetchAdminAppSettingsResult from "./components/results/CheckFetchAdminAppSettingsResult";
import { SendSetSessionRequest } from "./components/requests/SendSetSessionRequest";
import GlobalSettingsTabView from "./components/global_settings/GlobalSettingsTabView";

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

const AdminGlobalSettings = ({ handleFetchAdminAppSettingsRequest, forceAdminAppSettingsDataFetch, isAdminAppSettingsNotificationOpen, adminAppSettingsError, adminAppSettingsResponse, handleAdminAppSettingsNotificationClose, handleForceAdminAppSettingsDataFetch, updateChecks, setUpdateChecks }) => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('admin-globalsettings-pagetitle')} - Ask ${yourNickname}!`;
  }, [t]);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminAppSettingsError || forceAdminAppSettingsDataFetch) {
      handleFetchAdminAppSettingsRequest();
    }
  }, [
    adminAppSettingsError,
    forceAdminAppSettingsDataFetch,
    handleFetchAdminAppSettingsRequest
  ]);

  const [isCheckUpdatesNotificationOpen, setCheckUpdatesNotificationOpen] = useState(false);

  const { sessionUsername, handleSetSessionRequest } = SendSetSessionRequest();

  const { checkUpdatesStatus, checkUpdatesResponse, latestVersion, currentVersion, handleCheckUpdatesRequest } = SendCheckUpdatesRequest();

  const handleRequests = useCallback(async () => {
    await handleSetSessionRequest();

    if (updateChecks < 1) {
      await handleCheckUpdatesRequest();
      setUpdateChecks(1);
      setCheckUpdatesNotificationOpen(true);
    }

    setLoading(false);
  }, [
    handleSetSessionRequest,
    handleCheckUpdatesRequest,
    updateChecks,
    setUpdateChecks
  ]);

  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    handleRequests();
  }, [handleRequests]);

  const handleCheckUpdatesNotificationClose = () => {
    setCheckUpdatesNotificationOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <Box sx={{ padding: '8px', width: '100%' }}>
        <meta name="robots" content="noindex, nofollow" />

        <AdminNavbar displayName={sessionUsername} />

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
          {isLoading ? (
            <Box sx={{ minWidth: '300px' }}>
              <Typography component='p'>{t('loading')}</Typography>
              <LinearProgress sx={{ marginTop: '12px', width: '100%' }} />
            </Box>
          ) : (
            <GlobalSettingsTabView appSettings={adminAppSettingsResponse} forceDataFetch={handleForceAdminAppSettingsDataFetch} />
          )}
        </Box>

        <CheckFetchAdminAppSettingsResult open={isAdminAppSettingsNotificationOpen} error={adminAppSettingsError} response={adminAppSettingsResponse} onClose={handleAdminAppSettingsNotificationClose} />

        <CheckUpdatesResult open={isCheckUpdatesNotificationOpen} status={checkUpdatesStatus} response={checkUpdatesResponse} latestVersion={latestVersion} currentVersion={currentVersion} onClose={handleCheckUpdatesNotificationClose} />
      </Box>
    </Box>
  )
}

export default AdminGlobalSettings
