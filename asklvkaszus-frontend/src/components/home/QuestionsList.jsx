import React, { useEffect } from 'react';
import { Alert, Box, Card, CardContent, Divider, LinearProgress, Typography } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import MessageIcon from '@mui/icons-material/Message';
import MarkdownRenderer from '../markdown/MarkdownRenderer';
import { useTranslation } from 'react-i18next';
import { SendFetchAllQuestionsRequest } from '../requests/SendFetchAllQuestionsRequest';

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

const QuestionsList = ({ markdownFrontendEnabled, markdownAdminEnabled, forceDataFetch }) => {
  const { t } = useTranslation();

  const { isFetchAllQuestionsLoading, fetchAllQuestionsResponse, fetchAllQuestionsError, handleFetchAllQuestionsRequest } = SendFetchAllQuestionsRequest();

  useEffect(() => {
    if (forceDataFetch) {
      handleFetchAllQuestionsRequest();

    } else {
      handleFetchAllQuestionsRequest();

      const interval = setInterval(handleFetchAllQuestionsRequest, 360000);
    
      return () => {
        clearInterval(interval);
      };
    }
  }, [forceDataFetch]);
  
  return (
    fetchAllQuestionsError ? (
      <Alert severity='error' sx={{ marginTop: '16px' }}>{t('error-fetchquestionslist')}</Alert>
    ) : (
      isFetchAllQuestionsLoading ? (
        <Box sx={{ marginTop: '8px' }}>
          <Typography component='p'>{t('loading')}</Typography>
          <LinearProgress sx={{ marginTop: '12px', width: '100%' }} />
        </Box>
      ) : (
        <Box>
          <Typography component='p' sx={{ fontWeight: 500, fontSize: '20px', marginTop: '8px' }}>{t('ql-title')}</Typography>

          <Typography component='p' sx={{ fontWeight: 300, marginTop: '4px', marginBottom: '8px' }}>{t('ql-description')}</Typography>

          {fetchAllQuestionsResponse.message === 'No questions yet!' ? (
            <Alert severity='info' sx={{ marginTop: '16px' }}>{t('ql-noquestionsyet')}</Alert>
          ) : (
            fetchAllQuestionsResponse.map(({ answer, date, question, id }) => (
              <Box key={id} sx={{ wordBreak: 'break-word' }}>
                <Card variant="outlined" sx={{ marginY: '8px' }}>
                  <CardContent>
                    {markdownFrontendEnabled ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                        <HelpIcon />
                        <MarkdownRenderer content={question} />
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                        <HelpIcon />
                        <Typography component='p'>{question}</Typography>
                      </Box>
                    )}

                    <Divider />

                    {answer === 'Not answered yet!' ? (
                      <Typography component='p' sx={{ fontWeight: 500, marginY: '16px' }}>
                        {t('ql-notansweredyet', { nickname: yourNickname })}
                      </Typography>
                    ) : (
                      markdownAdminEnabled ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginY: '16px' }}>
                          <MessageIcon/>
                          <MarkdownRenderer content={answer} />
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                          <MessageIcon/>
                          <Typography component='p'>{answer}</Typography>
                        </Box>
                      )
                    )}
                                      
                    <Typography component='p' sx={{ fontWeight: 300, fontSize: '12px', marginTop: '12px' }}>{date}</Typography>
                  </CardContent>
                </Card>
              </Box>
            ))
          )}
        </Box>
      )
    )
  );
};
  
export default QuestionsList;