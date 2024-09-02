import React, { useEffect } from 'react';
import { Alert, Card, CardContent, Typography, Grid, Box, LinearProgress, Divider } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import MessageIcon from '@mui/icons-material/Message';
import MarkdownRenderer from '../../../components/markdown/MarkdownRenderer';
import { useTranslation } from 'react-i18next';
import ControlButtons from './ControlButtons';
import ManageQuestionMenu from './ManageQuestionMenu';
import AnswerQuestion from './AnswerQuestion';
import { SendFetchAllQuestionsRequest } from '../requests/SendFetchAllQuestionsRequest';

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

const QuestionsList = ({ markdownFrontendEnabled, markdownAdminEnabled, questionsNeedApproval, forceDataFetch, handleForceDataFetch, purgeAllQuestionsOutputData, PAQNotifyOpen, toggleAllQuestionsVisibilityOutputData, TAQVisibilityNotifyOpen, answerQuestionOutputData, AnswerQuestionNotifyOpen, purgeQuestionOutputData, PurgeQuestionNotifyOpen, toggleQuestionVisibilityOutputData, ToggleQuestionVisibilityNotifyOpen, blockSenderOutputData, BlockSenderNotifyOpen }) => {
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
        isFetchAllQuestionsLoading ? (
          <Box sx={{ minWidth: '300px' }}>
            <Typography component='p'>{t('loading')}</Typography>
            <LinearProgress sx={{ marginTop: '12px', width: '100%' }} />
          </Box>
        ) : (
            fetchAllQuestionsError ? (
              fetchAllQuestionsResponse === 'Please login again!' ? (
                <Alert severity='warning' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>{t('admin-error-pleaseloginagain')}</Alert>
              ) : (
                <Alert severity='error' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>{t('error-fetchquestionslist')}</Alert>
              )
            ) : (
              <Box maxWidth='lg' sx={{ width: '100%' }} className="fade-in">
                <Typography variant="subtitle1" component='h1' sx={{ fontSize: '24px', fontWeight: '500', textAlign: 'center' }}>{t('admin-ql-title')}</Typography>

                <Typography component='p' sx={{ marginTop: '4px', marginBottom: '8px', fontWeight: 300, textAlign: 'center' }}>{t('admin-ql-description')}</Typography>

                {fetchAllQuestionsResponse.message === 'No questions yet!' ? (
                  <Alert severity='info' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>{t('admin-ql-noquestionsyet')}</Alert>
                ) : (
                  <>
                    <ControlButtons purgeAllQuestionsOutputData={purgeAllQuestionsOutputData} PAQNotifyOpen={PAQNotifyOpen} toggleAllQuestionsVisibilityOutputData={toggleAllQuestionsVisibilityOutputData} TAQVisibilityNotifyOpen={TAQVisibilityNotifyOpen} handleForceDataFetch={handleForceDataFetch} />

                    {questionsNeedApproval && (
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Alert severity="warning" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '650px' }}>
                          {t('admin-ql-questionapprovalenabled')}
                        </Alert>
                      </Box>
                    )}

                    <Grid container spacing={2}>
                      {fetchAllQuestionsResponse.map(({ id, date, question, answer, hidden, ip_address }) => (
                        <Grid item xs={12} md={3} key={id} sx={{ wordBreak: 'break-word' }}>
                          <Card variant="outlined" sx={{ marginY: 2, height: '100%' }}>
                            <CardContent style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', height: '100%', width: '100%' }}>
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

                              <Typography component='p' sx={{ fontWeight: 300, fontSize: '12px', marginTop: 'auto' }}>{date}</Typography>
                              <Typography  component='p' sx={{ fontWeight: 300, fontSize: '12px' }}>{`${t('admin-ql-ishidden')} ${hidden ? t('yes') : t('no')}`}</Typography>

                              <AnswerQuestion
                                question_id={id}
                                questionText={question}
                                answer={answer}

                                markdownAdminEnabled={markdownAdminEnabled}

                                answerQuestionOutputData={answerQuestionOutputData}
                                AnswerQuestionNotifyOpen={AnswerQuestionNotifyOpen}

                                handleForceDataFetch={handleForceDataFetch}
                              />

                              <ManageQuestionMenu
                                question_id={id}
                                sender_ip={ip_address}

                                purgeQuestionOutputData={purgeQuestionOutputData}
                                PurgeQuestionNotifyOpen={PurgeQuestionNotifyOpen}

                                toggleQuestionVisibilityOutputData={toggleQuestionVisibilityOutputData}
                                ToggleQuestionVisibilityNotifyOpen={ToggleQuestionVisibilityNotifyOpen}

                                blockSenderOutputData={blockSenderOutputData}
                                BlockSenderNotifyOpen={BlockSenderNotifyOpen}

                                handleForceDataFetch={handleForceDataFetch}
                              />
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </Box>
            )
        )
      );      
};
  
export default QuestionsList;
