import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import Navbar from './components/Navbar.jsx';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import QuestionsList from './components/home/QuestionsList.jsx';
import SubmitQuestionForm from './components/home/SubmitQuestionForm.jsx';
import CheckFetchUserAppSettingsResult from './components/results/CheckFetchUserAppSettingsResult.jsx';

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

const Home = ({ isUserAppSettingsNotificationOpen, userAppSettingsError, userAppSettingsResponse, handleUserAppSettingsNotificationClose }) => {
  const { t } = useTranslation();

  const [forceQuestionsListDataFetch, setForceQuestionsListDataFetch] = useState(false);

  const handleQuestionsListUpdate = () => {
    setForceQuestionsListDataFetch((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <Box sx={{ padding: '8px' }}>
        <Helmet>
          <title>Ask {yourNickname}!</title>

          <meta name="robots" content="index, follow" />
        </Helmet>

        <Navbar />

        <Card variant="outlined" sx={{ marginBottom: '16px', maxWidth: '450px' }}>
          <CardContent>
            <Typography variant="h1" component='h1' sx={{ padding: '8px' }}>
              {t('home-title', { nickname: yourNickname })}
            </Typography>

            <SubmitQuestionForm markdownFrontendEnabled={userAppSettingsResponse.markdown_frontend_enabled} questionsNeedApproval={userAppSettingsResponse.approve_questions_first} forceQuestionsListDataFetch={handleQuestionsListUpdate}/>

            <Divider />

            <QuestionsList markdownFrontendEnabled={userAppSettingsResponse.markdown_frontend_enabled} markdownAdminEnabled={userAppSettingsResponse.markdown_admin_enabled} forceDataFetch={forceQuestionsListDataFetch}/>
          </CardContent>

          <CheckFetchUserAppSettingsResult open={isUserAppSettingsNotificationOpen} error={userAppSettingsError} response={userAppSettingsResponse} onClose={handleUserAppSettingsNotificationClose} />
        </Card>
      </Box>
    </Box>
  )
}

export default Home;