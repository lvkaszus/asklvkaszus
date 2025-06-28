import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar.jsx';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import QuestionsList from './components/home/QuestionsList.jsx';
import SubmitQuestionForm from './components/home/SubmitQuestionForm.jsx';
import CheckFetchUserAppSettingsResult from './components/results/CheckFetchUserAppSettingsResult.jsx';

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

const Home = ({ handleFetchUserAppSettingsRequest, isUserAppSettingsNotificationOpen, userAppSettingsError, userAppSettingsResponse, handleUserAppSettingsNotificationClose }) => {
  const { t } = useTranslation();

  useEffect(() => {
    // Using `document.title` here, because <title> HTML tag in React 19 don't work with JavaScript variables.
    document.title = `Ask ${yourNickname}!`;
  }, [yourNickname]);

  useEffect(() => {
    if (!userAppSettingsError) {
      handleFetchUserAppSettingsRequest();
    }
  }, [userAppSettingsError]);

  const [forceQuestionsListDataFetch, setForceQuestionsListDataFetch] = useState(false);

  const handleQuestionsListUpdate = () => {
    setForceQuestionsListDataFetch((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <Box sx={{ padding: '8px' }}>
        <meta name="robots" content="index, follow" />

        <Navbar />

        <Card variant="outlined" sx={{ marginBottom: '16px', maxWidth: '450px' }}>
          <CardContent>
            <Typography variant="h1" component='h1' sx={{ padding: '8px' }}>
              {t('home-title', { nickname: yourNickname })}
            </Typography>

            <SubmitQuestionForm markdownFrontendEnabled={userAppSettingsResponse?.markdown_frontend_enabled} questionsNeedApproval={userAppSettingsResponse?.approve_questions_first} captchaEnabled={userAppSettingsResponse?.captcha_enabled} captchaProvider={userAppSettingsResponse?.captcha_provider} captchaSiteKey={userAppSettingsResponse?.captcha_site_key} forceQuestionsListDataFetch={handleQuestionsListUpdate}/>

            <Divider />

            <QuestionsList markdownFrontendEnabled={userAppSettingsResponse?.markdown_frontend_enabled} markdownAdminEnabled={userAppSettingsResponse?.markdown_admin_enabled} forceDataFetch={forceQuestionsListDataFetch}/>
          </CardContent>

          <CheckFetchUserAppSettingsResult open={isUserAppSettingsNotificationOpen} error={userAppSettingsError} response={userAppSettingsResponse} onClose={handleUserAppSettingsNotificationClose} />
        </Card>
      </Box>
    </Box>
  )
}

export default Home;