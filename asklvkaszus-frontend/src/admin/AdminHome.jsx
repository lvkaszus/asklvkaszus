import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import AdminNavbar from "./components/navbar/AdminNavbar";
import { Box, LinearProgress, Typography } from "@mui/material";
import CheckUpdatesResult from "./components/results/CheckUpdatesResult";
import { SendCheckUpdatesRequest } from "./components/requests/SendCheckUpdatesRequest";
import QuestionsList from "./components/home/QuestionsList";
import CheckPurgeAllQuestionsResult from "./components/results/CheckPurgeAllQuestionsResult";
import CheckToggleAllQuestionsVisibilityResult from "./components/results/CheckToggleAllQuestionsVisibilityResult";
import CheckPurgeQuestionResult from "./components/results/CheckPurgeQuestionResult";
import CheckToggleQuestionVisibilityResult from "./components/results/CheckToggleQuestionVisibilityResult";
import CheckBlockSenderResult from "./components/results/CheckBlockSenderResult";
import CheckAnswerQuestionResult from "./components/results/CheckAnswerQuestionResult";
import CheckFetchAdminAppSettingsResult from "./components/results/CheckFetchAdminAppSettingsResult";
import { SendSetSessionRequest } from "./components/requests/SendSetSessionRequest";

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

const AdminHome = ({ isAdminAppSettingsNotificationOpen, adminAppSettingsError, adminAppSettingsResponse, handleAdminAppSettingsNotificationClose, updateChecks, setUpdateChecks }) => {
    const { t } = useTranslation();

    const [isLoading, setLoading] = useState(true);

    const [isCheckUpdatesNotificationOpen, setCheckUpdatesNotificationOpen] = useState(false);

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

    const [forceAdminQuestionsListDataFetch, setForceAdminQuestionsListDataFetch] = useState(false);

    const handleAdminQuestionsListUpdate = () => {
      setForceAdminQuestionsListDataFetch((prev) => !prev);
    };

    const [purgeAllQuestionsStatus, setPurgeAllQuestionsStatus] = useState('');
    const [purgeAllQuestionsResponse, setPurgeAllQuestionsResponse] = useState('');
  
    const purgeAllQuestionsOutputData = (status, response) => {
      setPurgeAllQuestionsStatus(status);
      setPurgeAllQuestionsResponse(response);
    };

    const [isPurgeAllQuestionsNotificationOpen, setPurgeAllQuestionsNotificationOpen] = useState(false);

    const handlePurgeAllQuestionsNotificationClose = () => {
      setPurgeAllQuestionsNotificationOpen(false);
    };

    const [toggleAllQuestionsVisibilityStatus, setToggleAllQuestionsVisibilityStatus] = useState('');
    const [toggleAllQuestionsVisibilityResponse, setToggleAllQuestionsVisibilityResponse] = useState('');
  
    const toggleAllQuestionsVisibilityOutputData = (status, response) => {
      setToggleAllQuestionsVisibilityStatus(status);
      setToggleAllQuestionsVisibilityResponse(response);
    };
      
    const [isToggleQuestionsVisibilityNotificationOpen, setToggleQuestionsVisibilityNotificationOpen] = useState(false);

    const handleToggleQuestionsVisibilityNotificationClose = () => {
      setToggleQuestionsVisibilityNotificationOpen(false);
    };

    const [answerQuestionStatus, setAnswerQuestionStatus] = useState('');
    const [answerQuestionResponse, setAnswerQuestionResponse] = useState('');
  
    const answerQuestionOutputData = (status, response) => {
      setAnswerQuestionStatus(status);
      setAnswerQuestionResponse(response);
    };

    const [isAnswerQuestionNotificationOpen, setAnswerQuestionNotificationOpen] = useState(false);

    const handleAnswerQuestionNotificationClose = () => {
      setAnswerQuestionNotificationOpen(false);
    }

    const [purgeQuestionStatus, setPurgeQuestionStatus] = useState('');
    const [purgeQuestionResponse, setPurgeQuestionResponse] = useState('');
  
    const purgeQuestionOutputData = (status, response) => {
      setPurgeQuestionStatus(status);
      setPurgeQuestionResponse(response);
    };

    const [isPurgeQuestionNotificationOpen, setPurgeQuestionNotificationOpen] = useState(false);
      
    const handlePurgeQuestionNotificationClose = () => {
      setPurgeQuestionNotificationOpen(false);
    };

    const [toggleQuestionVisibilityStatus, setToggleQuestionVisibilityStatus] = useState('');
    const [toggleQuestionVisibilityResponse, setToggleQuestionVisibilityResponse] = useState('');
  
    const toggleQuestionVisibilityOutputData = (status, response) => {
      setToggleQuestionVisibilityStatus(status);
      setToggleQuestionVisibilityResponse(response);
    };

    const [isToggleQuestionVisibilityNotificationOpen, setToggleQuestionVisibilityNotificationOpen] = useState(false);

    const handleToggleQuestionVisibilityNotificationClose = () => {
      setToggleQuestionVisibilityNotificationOpen(false);
    };

    const [blockSenderStatus, setBlockSenderStatus] = useState('');
    const [blockSenderResponse, setBlockSenderResponse] = useState('');
    const [blockSenderIp, setBlockSenderIp] = useState('');
  
    const blockSenderOutputData = (status, response, sender_ip) => {
      setBlockSenderStatus(status);
      setBlockSenderResponse(response);
      setBlockSenderIp(sender_ip);
    };

    const [isBlockSenderNotificationOpen, setBlockSenderNotificationOpen] = useState(false);

    const handleBlockSenderNotificationClose = () => {
      setBlockSenderNotificationOpen(false);
    };

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
        <Box sx={{ padding: '8px', width: '100%' }}>
          <Helmet>
            <title>{t('admin-home-pagetitle')} - Ask {yourNickname}!</title>

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
                <QuestionsList
                  markdownFrontendEnabled={adminAppSettingsResponse.markdown_frontend_enabled}
                  markdownAdminEnabled={adminAppSettingsResponse.markdown_admin_enabled}
                  questionsNeedApproval={adminAppSettingsResponse.approve_questions_first}
                  
                  forceDataFetch={forceAdminQuestionsListDataFetch}
                  handleForceDataFetch={handleAdminQuestionsListUpdate}
                  
                  purgeAllQuestionsOutputData={purgeAllQuestionsOutputData}
                  PAQNotifyOpen={setPurgeAllQuestionsNotificationOpen} 
                  
                  toggleAllQuestionsVisibilityOutputData={toggleAllQuestionsVisibilityOutputData}
                  TAQVisibilityNotifyOpen={setToggleQuestionsVisibilityNotificationOpen}

                  answerQuestionOutputData={answerQuestionOutputData}
                  AnswerQuestionNotifyOpen={setAnswerQuestionNotificationOpen}
                  
                  purgeQuestionOutputData={purgeQuestionOutputData}
                  PurgeQuestionNotifyOpen={setPurgeQuestionNotificationOpen}
                  
                  toggleQuestionVisibilityOutputData={toggleQuestionVisibilityOutputData}
                  ToggleQuestionVisibilityNotifyOpen={setToggleQuestionVisibilityNotificationOpen}
                  
                  blockSenderOutputData={blockSenderOutputData}
                  BlockSenderNotifyOpen={setBlockSenderNotificationOpen}
                />
            )}
          </Box>

          <CheckFetchAdminAppSettingsResult open={isAdminAppSettingsNotificationOpen} error={adminAppSettingsError} response={adminAppSettingsResponse} onClose={handleAdminAppSettingsNotificationClose} />

          <CheckUpdatesResult open={isCheckUpdatesNotificationOpen} status={checkUpdatesStatus} response={checkUpdatesResponse} latestVersion={latestVersion} currentVersion={currentVersion} onClose={handleCheckUpdatesNotificationClose} />

          <CheckPurgeAllQuestionsResult open={isPurgeAllQuestionsNotificationOpen} error={purgeAllQuestionsStatus} response={purgeAllQuestionsResponse} onClose={handlePurgeAllQuestionsNotificationClose} />

          <CheckToggleAllQuestionsVisibilityResult open={isToggleQuestionsVisibilityNotificationOpen} error={toggleAllQuestionsVisibilityStatus} response={toggleAllQuestionsVisibilityResponse} onClose={handleToggleQuestionsVisibilityNotificationClose} />

          <CheckAnswerQuestionResult open={isAnswerQuestionNotificationOpen} error={answerQuestionStatus} response={answerQuestionResponse} onClose={handleAnswerQuestionNotificationClose} />

          <CheckPurgeQuestionResult open={isPurgeQuestionNotificationOpen} error={purgeQuestionStatus} response={purgeQuestionResponse} onClose={handlePurgeQuestionNotificationClose} />

          <CheckToggleQuestionVisibilityResult open={isToggleQuestionVisibilityNotificationOpen} error={toggleQuestionVisibilityStatus} response={toggleQuestionVisibilityResponse} onClose={handleToggleQuestionVisibilityNotificationClose} />

          <CheckBlockSenderResult open={isBlockSenderNotificationOpen} error={blockSenderStatus} response={blockSenderResponse} sender_ip={blockSenderIp} onClose={handleBlockSenderNotificationClose} />
        </Box>
      </Box>
    )
}

export default AdminHome
