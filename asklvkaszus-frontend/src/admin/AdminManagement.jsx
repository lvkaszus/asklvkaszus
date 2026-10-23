import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import AdminNavbar from "./components/navbar/AdminNavbar";
import { Box, LinearProgress, Typography } from "@mui/material";
import CheckUpdatesResult from "./components/results/CheckUpdatesResult";
import { SendCheckUpdatesRequest } from "./components/requests/SendCheckUpdatesRequest";
import CheckFetchAdminAppSettingsResult from "./components/results/CheckFetchAdminAppSettingsResult";
import { SendFetchBlockedSendersRequest } from "./components/requests/SendFetchBlockedSendersRequest";
import ManagementTable from "./components/management/ManagementTable";
import CheckUnblockAllSendersResult from "./components/results/CheckUnblockAllSendersResult";
import CheckUnblockSenderResult from "./components/results/CheckUnblockSenderResult";
import { SendSetSessionRequest } from "./components/requests/SendSetSessionRequest";

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

const AdminManagement = ({ handleFetchAdminAppSettingsRequest, forceAdminAppSettingsDataFetch, isAdminAppSettingsNotificationOpen, adminAppSettingsError, adminAppSettingsResponse, handleAdminAppSettingsNotificationClose, updateChecks, setUpdateChecks }) => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('admin-management-pagetitle')} - Ask ${yourNickname}!`;
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

  const [forceBlockedSendersDataFetch, setForceBlockedSendersDataFetch] = useState(false);

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

  const { isBlockedSendersLoading, blockedSendersError, blockedSendersResponse, handleFetchBlockedSendersRequest } = SendFetchBlockedSendersRequest();
  
  useEffect(() => {
    handleFetchBlockedSendersRequest();
  }, [forceBlockedSendersDataFetch, handleFetchBlockedSendersRequest]);
    
  const handleBlockedSendersDataUpdate = () => {
    setForceBlockedSendersDataFetch((prev) => !prev);
  };

  const [unblockAllSendersStatus, setUnblockAllSendersStatus] = useState('');
  const [unblockAllSendersResponse, setUnblockAllSendersResponse] = useState('');
  
  const unblockAllSendersOutputData = useCallback((status, response) => {
    setUnblockAllSendersStatus(status);
    setUnblockAllSendersResponse(response);
  }, []);

  const [isUnblockAllSendersNotificationOpen, setUnblockAllSendersNotificationOpen] = useState(false);

  const handleUnblockAllSendersNotificationClose = () => {
    setUnblockAllSendersNotificationOpen(false);
  };

  const [unblockSenderStatus, setUnblockSenderStatus] = useState('');
  const [unblockSenderResponse, setUnblockSenderResponse] = useState('');
  const [senderIp, setSenderIp] = useState('');
  
  const unblockSenderOutputData = useCallback((status, response, sender_ip) => {
      setUnblockSenderStatus(status);
      setUnblockSenderResponse(response);
      setSenderIp(sender_ip);
  }, []);

  const [isUnblockSenderNotificationOpen, setUnblockSenderNotificationOpen] = useState(false);

  const handleUnblockSenderNotificationClose = () => {
    setUnblockSenderNotificationOpen(false);
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
            <ManagementTable isBlockedSendersLoading={isBlockedSendersLoading} blockedSendersError={blockedSendersError} blockedSendersResponse={blockedSendersResponse} unblockAllSendersOutputData={unblockAllSendersOutputData} setUnblockAllSendersNotifyOpen={setUnblockAllSendersNotificationOpen} unblockSenderOutputData={unblockSenderOutputData} setUnblockSenderNotifyOpen={setUnblockSenderNotificationOpen} forceDataFetch={handleBlockedSendersDataUpdate} />
          )}
        </Box>

        <CheckFetchAdminAppSettingsResult open={isAdminAppSettingsNotificationOpen} error={adminAppSettingsError} response={adminAppSettingsResponse} onClose={handleAdminAppSettingsNotificationClose} />

        <CheckUpdatesResult open={isCheckUpdatesNotificationOpen} status={checkUpdatesStatus} response={checkUpdatesResponse} latestVersion={latestVersion} currentVersion={currentVersion} onClose={handleCheckUpdatesNotificationClose} />

        <CheckUnblockAllSendersResult open={isUnblockAllSendersNotificationOpen} error={unblockAllSendersStatus} response={unblockAllSendersResponse} onClose={handleUnblockAllSendersNotificationClose} />

        <CheckUnblockSenderResult open={isUnblockSenderNotificationOpen} error={unblockSenderStatus} response={unblockSenderResponse} sender_ip={senderIp} onClose={handleUnblockSenderNotificationClose} />
      </Box>
    </Box>
  )
}

export default AdminManagement
